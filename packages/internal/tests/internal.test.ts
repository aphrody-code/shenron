import { describe, expect, test } from "bun:test";

import { Decorator, getLinkedObjects, Modifier } from "../src/index.js";

// These three are the package's only RUNTIME exports — everything else in
// src/index.ts (`export type * from "./types/decorators.js"`) is type-only and
// erases at compile time, so it has no observable runtime surface to assert.

describe("@rpbey/internal", () => {
	describe("runtime exports exist", () => {
		test("Decorator, Modifier and getLinkedObjects are real runtime values", () => {
			expect(typeof Decorator).toBe("function"); // class
			expect(typeof Modifier).toBe("function"); // class
			expect(typeof getLinkedObjects).toBe("function");
		});
	});

	describe("Decorator metadata", () => {
		test("decorate() records target, key, method, source and param index", () => {
			class Host {}
			const method = () => "x";
			const d = new Decorator().decorate(Host, "run", method, Host, 2);

			expect(d.classRef).toBe(Host);
			expect(d.key).toBe("run");
			expect(d.method).toBe(method);
			expect(d.from).toBe(Host);
			expect(d.index).toBe(2);
			// _methodReference is set → treated as a class-level decoration
			expect(d.isClass).toBe(true);
		});

		test("from defaults to the target class when no source is given", () => {
			class Host {}
			const d = new Decorator().decorate(Host, "prop");
			expect(d.from).toBe(Host);
			expect(d.method).toBeUndefined();
			expect(d.index).toBeUndefined();
			expect(d.isClass).toBe(false);
		});

		test("setting classRef also updates `from`", () => {
			const d = new Decorator().decorate({}, "k");
			const ref = { name: "Other" };
			d.classRef = ref;
			expect(d.classRef).toBe(ref);
			expect(d.from).toBe(ref);
		});

		test("attachToTarget on a class decoration uses the constructor itself", () => {
			class MyBot {}
			const d = new Decorator().attachToTarget(MyBot);
			// class decoration: resolvedClass === constructor, key === class name
			expect(d.classRef).toBe(MyBot);
			expect(d.key).toBe("MyBot");
			expect(d.method).toBe(MyBot);
			expect(d.index).toBeUndefined();
		});
	});

	describe("getLinkedObjects", () => {
		test("links decorators applied to the same class + key", () => {
			class Host {}
			const ref = new Decorator().decorate(Host, "method");
			const same = new Decorator().decorate(Host, "method");
			const otherKey = new Decorator().decorate(Host, "other");

			const linked = getLinkedObjects(ref, [ref, same, otherKey]);
			expect(linked).toContain(ref);
			expect(linked).toContain(same);
			expect(linked).not.toContain(otherKey);
			expect(linked.length).toBe(2);
		});

		test("parameter decorators only link to the same parameter index", () => {
			class Host {}
			// same class+key, but different parameter positions
			const param0a = new Decorator().decorate(Host, "m", undefined, Host, 0);
			const param0b = new Decorator().decorate(Host, "m", undefined, Host, 0);
			const param1 = new Decorator().decorate(Host, "m", undefined, Host, 1);

			const linked = getLinkedObjects(param0a, [param0a, param0b, param1]);
			expect(linked).toContain(param0a);
			expect(linked).toContain(param0b);
			expect(linked).not.toContain(param1);
		});

		test("does not link across different source classes", () => {
			class A {}
			class B {}
			const ref = new Decorator().decorate(A, "method");
			const other = new Decorator().decorate(B, "method");
			expect(getLinkedObjects(ref, [ref, other])).toEqual([ref]);
		});
	});

	describe("Modifier", () => {
		test("Modifier.create builds a Modifier carrying its applicable types", () => {
			const m = Modifier.create<Decorator>(() => {
				/* noop */
			}, Decorator);
			expect(m).toBeInstanceOf(Modifier);
			expect(m).toBeInstanceOf(Decorator); // Modifier extends Decorator
		});

		test("apply() invokes the modification function on the target", async () => {
			const seen: Decorator[] = [];
			const target = new Decorator().decorate({}, "k");
			const m = Modifier.create<Decorator>((d) => {
				seen.push(d);
			}, Decorator);

			await m.apply(target);
			expect(seen).toEqual([target]);
		});

		test("modify() only mutates linked decorators of the applicable type", async () => {
			class Host {}
			// Modifier is co-located with the decorator it targets (same class+key).
			const touched: string[] = [];
			const modifier = Modifier.create<Decorator>((d) => {
				touched.push(d.key);
			}, Decorator);
			modifier.decorate(Host, "target");

			const linkedDecorator = new Decorator().decorate(Host, "target");
			const unrelatedDecorator = new Decorator().decorate(Host, "elsewhere");

			await Modifier.modify([modifier], [linkedDecorator, unrelatedDecorator]);

			// Only the decorator sharing the modifier's location was visited.
			expect(touched).toEqual(["target"]);
		});

		test("modify() skips decorators whose type is not applicable", async () => {
			class Host {}
			class OtherDecorator extends Decorator {}

			const calls: number[] = [];
			const modifier = Modifier.create<OtherDecorator>(() => {
				calls.push(1);
			}, OtherDecorator);
			modifier.decorate(Host, "target");

			// A plain Decorator at the same location is NOT an OtherDecorator instance.
			const plain = new Decorator().decorate(Host, "target");

			await Modifier.modify([modifier], [plain]);
			expect(calls).toEqual([]);
		});
	});
});
