import "reflect-metadata";
import { afterEach, describe, expect, test } from "bun:test";

import {
  defaultDependencyRegistryEngine,
  DIService,
  tsyringeDependencyRegistryEngine,
  typeDiDependencyRegistryEngine,
} from "../src/index.js";

describe("@rpbey/di", () => {
  describe("DIService.engine", () => {
    afterEach(() => {
      // Always restore the global default engine for isolation.
      DIService.engine = defaultDependencyRegistryEngine;
    });

    test("defaults to the default dependency registry engine", () => {
      expect(DIService.engine).toBe(defaultDependencyRegistryEngine);
    });

    test("the deprecated `instance` getter mirrors `engine`", () => {
      expect(DIService.instance).toBe(DIService.engine);
    });

    test("setting the engine then reading returns the same instance", () => {
      DIService.engine = tsyringeDependencyRegistryEngine;
      expect(DIService.engine).toBe(tsyringeDependencyRegistryEngine);

      DIService.engine = typeDiDependencyRegistryEngine;
      expect(DIService.engine).toBe(typeDiDependencyRegistryEngine);
    });
  });

  describe("util engine instances are singletons", () => {
    test("each built-in engine export is a distinct, non-null object", () => {
      expect(defaultDependencyRegistryEngine).toBeDefined();
      expect(tsyringeDependencyRegistryEngine).toBeDefined();
      expect(typeDiDependencyRegistryEngine).toBeDefined();

      expect(defaultDependencyRegistryEngine).not.toBe(
        tsyringeDependencyRegistryEngine,
      );
      expect(defaultDependencyRegistryEngine).not.toBe(
        typeDiDependencyRegistryEngine,
      );
      expect(tsyringeDependencyRegistryEngine).not.toBe(
        typeDiDependencyRegistryEngine,
      );
    });
  });

  describe("DefaultDependencyRegistryEngine — real DI behaviour", () => {
    afterEach(() => {
      defaultDependencyRegistryEngine.clearAllServices();
    });

    test("addService constructs the class and getService returns that instance", () => {
      class Repository {
        public readonly tag = "repo";
      }

      defaultDependencyRegistryEngine.addService(Repository);
      const instance = defaultDependencyRegistryEngine.getService(Repository);

      expect(instance).toBeInstanceOf(Repository);
      expect(instance?.tag).toBe("repo");
    });

    test("getService returns the SAME instance on repeated lookups (singleton)", () => {
      class Cache {}
      defaultDependencyRegistryEngine.addService(Cache);

      const a = defaultDependencyRegistryEngine.getService(Cache);
      const b = defaultDependencyRegistryEngine.getService(Cache);
      expect(a).toBe(b);
    });

    test("getAllServices returns every registered instance", () => {
      class A {}
      class B {}
      defaultDependencyRegistryEngine.addService(A);
      defaultDependencyRegistryEngine.addService(B);

      const all = defaultDependencyRegistryEngine.getAllServices();
      expect(all).toBeInstanceOf(Set);
      expect(all.size).toBe(2);

      const instances = [...all];
      expect(instances.some((i) => i instanceof A)).toBe(true);
      expect(instances.some((i) => i instanceof B)).toBe(true);
    });

    test("clearAllServices empties the registry", () => {
      class Service {}
      defaultDependencyRegistryEngine.addService(Service);
      expect(defaultDependencyRegistryEngine.getService(Service)).toBeInstanceOf(
        Service,
      );

      defaultDependencyRegistryEngine.clearAllServices();
      expect(
        defaultDependencyRegistryEngine.getService(Service),
      ).toBeUndefined();
      expect(defaultDependencyRegistryEngine.getAllServices().size).toBe(0);
    });

    test("re-adding a class replaces the prior instance with a fresh one", () => {
      class Stateful {
        public readonly id = Math.random();
      }
      defaultDependencyRegistryEngine.addService(Stateful);
      const first = defaultDependencyRegistryEngine.getService(Stateful);

      defaultDependencyRegistryEngine.addService(Stateful);
      const second = defaultDependencyRegistryEngine.getService(Stateful);

      expect(first).not.toBe(second);
    });
  });
});
