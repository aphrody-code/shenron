import { describe, expect, test } from "bun:test";

import {
  createPagination,
  defaultIds,
  defaultPerPageItem,
  defaultTime,
  PaginationResolver,
  SelectMenuPageId,
} from "../src/index.js";

describe("@rpbey/pagination", () => {
  describe("createPagination — page math", () => {
    test("computes total pages, indexes and page list for a middle page", () => {
      const p = createPagination({
        currentPage: 5,
        maxPages: 7,
        pageSize: 10,
        totalItems: 100,
      });

      expect(p.totalItems).toBe(100);
      expect(p.totalPages).toBe(10); // ceil(100 / 10)
      expect(p.currentPage).toBe(5);
      expect(p.pageSize).toBe(10);
      // page 5 (0-based) → items 50..59
      expect(p.startIndex).toBe(50);
      expect(p.endIndex).toBe(59);
      // 7-wide window centred on page 5 → 2..8
      expect(p.startPage).toBe(2);
      expect(p.endPage).toBe(8);
      expect(p.pages).toEqual([2, 3, 4, 5, 6, 7, 8]);
    });

    test("applies defaults (currentPage 0, pageSize 10, maxPages 10)", () => {
      const p = createPagination({ totalItems: 25 });
      expect(p.currentPage).toBe(0);
      expect(p.pageSize).toBe(10);
      expect(p.totalPages).toBe(3); // ceil(25 / 10)
      expect(p.startIndex).toBe(0);
      expect(p.endIndex).toBe(9);
      // totalPages (3) <= maxPages (10) → full range
      expect(p.pages).toEqual([0, 1, 2]);
    });

    test("clamps an out-of-range currentPage to the last page", () => {
      const p = createPagination({
        currentPage: 999,
        pageSize: 10,
        totalItems: 25,
      });
      // last valid 0-based page is 2
      expect(p.currentPage).toBe(2);
      expect(p.startIndex).toBe(20);
      expect(p.endIndex).toBe(24); // min(29, totalItems-1)
    });

    test("window sticks to the start when current page is near the start", () => {
      const p = createPagination({
        currentPage: 0,
        maxPages: 5,
        pageSize: 1,
        totalItems: 20,
      });
      expect(p.totalPages).toBe(20);
      expect(p.startPage).toBe(0);
      expect(p.endPage).toBe(4);
      expect(p.pages).toEqual([0, 1, 2, 3, 4]);
    });

    test("window sticks to the end when current page is near the end", () => {
      const p = createPagination({
        currentPage: 19,
        maxPages: 5,
        pageSize: 1,
        totalItems: 20,
      });
      expect(p.startPage).toBe(15);
      expect(p.endPage).toBe(19);
      expect(p.pages).toEqual([15, 16, 17, 18, 19]);
    });

    test("handles zero items (no pages)", () => {
      const p = createPagination({ totalItems: 0 });
      expect(p.totalPages).toBe(0);
      expect(p.currentPage).toBe(0);
      expect(p.pages).toEqual([]);
    });

    test("rejects a negative totalItems", () => {
      expect(() => createPagination({ totalItems: -1 })).toThrow(
        /Pagination creation failed/,
      );
    });

    test("rejects a non-integer pageSize", () => {
      expect(() =>
        createPagination({ pageSize: 2.5, totalItems: 10 }),
      ).toThrow(/Page size must be a positive integer/);
    });

    test("rejects a zero pageSize", () => {
      expect(() =>
        createPagination({ pageSize: 0, totalItems: 10 }),
      ).toThrow(/Page size must be a positive integer/);
    });

    test("rejects a maxPages below 1", () => {
      expect(() =>
        createPagination({ maxPages: 0, totalItems: 10 }),
      ).toThrow(/Max pages must be a positive integer/);
    });
  });

  describe("PaginationResolver — pure container", () => {
    test("stores the resolver function and maxLength verbatim", () => {
      const fn = (page: number) => ({ content: `page ${page.toString()}` });
      const r = new PaginationResolver(fn, 42);
      expect(r.resolver).toBe(fn);
      expect(r.maxLength).toBe(42);
    });

    test("the stored sync resolver is callable and returns its item", () => {
      const r = new PaginationResolver(
        (page) => ({ content: `p${page.toString()}` }),
        3,
      );
      expect(r.resolver(2, undefined as never)).toEqual({ content: "p2" });
    });

    test("an async resolver is awaited through the stored reference", async () => {
      const r = new PaginationResolver(
        async (page) => Promise.resolve({ content: `p${page.toString()}` }),
        3,
      );
      await expect(r.resolver(7, undefined as never)).resolves.toEqual({
        content: "p7",
      });
    });
  });

  describe("pure exported constants", () => {
    test("defaultPerPageItem and defaultTime", () => {
      expect(defaultPerPageItem).toBe(10);
      expect(defaultTime).toBe(3e5); // five minutes in ms
    });

    test("defaultIds use the discordx@pagination@ prefix", () => {
      const prefix = "discordx@pagination@";
      expect(defaultIds.menu).toBe(`${prefix}menu`);
      expect(defaultIds.buttons.previous).toBe(`${prefix}previous`);
      expect(defaultIds.buttons.backward).toBe(`${prefix}backward`);
      expect(defaultIds.buttons.forward).toBe(`${prefix}forward`);
      expect(defaultIds.buttons.next).toBe(`${prefix}next`);
      expect(defaultIds.buttons.exit).toBe(`${prefix}exit`);
    });

    test("SelectMenuPageId sentinels", () => {
      expect(SelectMenuPageId.Start).toBe(-1);
      expect(SelectMenuPageId.End).toBe(-2);
    });
  });

  // NOTE: PaginationBuilder and the Pagination class are NOT unit-tested here.
  // Their constructors/methods depend on live discord.js objects (Message,
  // CommandInteraction, ButtonBuilder collectors, channel.send), which require
  // a real Discord gateway/REST context. They are exercised by the bot's
  // integration paths, not by these offline, network-free unit tests.
});
