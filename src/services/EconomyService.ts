import { singleton, inject } from "tsyringe";
import { and, eq, sql, desc, or } from "drizzle-orm";
import { DatabaseService } from "~/db/index";
import { users, inventory, shopItems, fusions, achievements, actionLogs } from "~/db/schema";
import { FUSION_ZENI_BONUS_RATIO } from "~/lib/constants";

@singleton()
export class EconomyService {
  constructor(@inject(DatabaseService) private dbs: DatabaseService) {}

  private get db() {
    return this.dbs.db;
  }

  async ensureUser(userId: string) {
    await this.db.insert(users).values({ id: userId }).onConflictDoNothing();
  }

  async getBalance(userId: string): Promise<number> {
    await this.ensureUser(userId);
    const u = await this.db.query.users.findFirst({ where: eq(users.id, userId) });
    return u?.zeni ?? 0;
  }

  async addZeni(userId: string, amount: number, options: { propagateFusion?: boolean } = { propagateFusion: true }): Promise<number | undefined> {
    await this.ensureUser(userId);
    await this.db.update(users).set({ zeni: sql`${users.zeni} + ${amount}`, updatedAt: new Date() }).where(eq(users.id, userId));

    if (options.propagateFusion && amount > 0) {
      const partner = await this.partnerOf(userId);
      if (partner) {
        const bonus = Math.floor(amount * FUSION_ZENI_BONUS_RATIO);
        if (bonus > 0) {
          await this.addZeni(partner, bonus, { propagateFusion: false });
          return bonus;
        }
      }
    }
    return undefined;
  }

  async removeZeni(userId: string, amount: number): Promise<boolean> {
    await this.ensureUser(userId);
    const u = await this.db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!u || u.zeni < amount) return false;
    await this.db.update(users).set({ zeni: sql`${users.zeni} - ${amount}`, updatedAt: new Date() }).where(eq(users.id, userId));
    return true;
  }

  async setZeni(userId: string, amount: number) {
    await this.ensureUser(userId);
    await this.db.update(users).set({ zeni: amount, updatedAt: new Date() }).where(eq(users.id, userId));
  }

  // Shop
  async listShop(type?: "card" | "badge" | "color" | "title") {
    if (type) {
      return this.db.select().from(shopItems).where(and(eq(shopItems.enabled, true), eq(shopItems.type, type)));
    }
    return this.db.select().from(shopItems).where(eq(shopItems.enabled, true));
  }

  async getShopItem(key: string) {
    return this.db.query.shopItems.findFirst({ where: eq(shopItems.key, key) });
  }

  async grantItem(userId: string, type: "card" | "badge" | "color" | "title", key: string) {
    await this.ensureUser(userId);
    await this.db.insert(inventory).values({ userId, itemType: type, itemKey: key }).onConflictDoNothing();
  }

  async removeItem(userId: string, type: "card" | "badge" | "color" | "title", key: string) {
    await this.db
      .delete(inventory)
      .where(and(eq(inventory.userId, userId), eq(inventory.itemType, type), eq(inventory.itemKey, key)));
  }

  async ownsItem(userId: string, type: "card" | "badge" | "color" | "title", key: string): Promise<boolean> {
    const row = await this.db.query.inventory.findFirst({
      where: and(eq(inventory.userId, userId), eq(inventory.itemType, type), eq(inventory.itemKey, key)),
    });
    return !!row;
  }

  async purchase(userId: string, itemKey: string): Promise<{ ok: boolean; reason?: string; price?: number; roleId?: string | null }> {
    const item = await this.getShopItem(itemKey);
    if (!item || !item.enabled) return { ok: false, reason: "Objet introuvable" };
    if (await this.ownsItem(userId, item.type, item.key)) return { ok: false, reason: "Déjà possédé" };

    const balance = await this.getBalance(userId);
    if (balance < item.price) return { ok: false, reason: `Solde insuffisant (${balance}/${item.price})` };

    const removed = await this.removeZeni(userId, item.price);
    if (!removed) return { ok: false, reason: "Solde insuffisant" };

    await this.db.insert(inventory).values({ userId, itemType: item.type, itemKey: item.key });
    await this.db.insert(actionLogs).values({
      userId,
      action: "SHOP_PURCHASE",
      meta: JSON.stringify({ item: item.key, price: item.price }),
    });
    return { ok: true, price: item.price, roleId: item.roleId };
  }

  async listInventory(userId: string) {
    return this.db.select().from(inventory).where(eq(inventory.userId, userId));
  }

  async equip(userId: string, type: "card" | "badge" | "color" | "title", key: string): Promise<boolean> {
    if (!(await this.ownsItem(userId, type, key))) return false;
    const patch: Record<string, string | null> = {};
    if (type === "card") patch.equippedCard = key;
    if (type === "badge") patch.equippedBadge = key;
    if (type === "color") patch.equippedColor = key;
    if (type === "title") patch.equippedTitle = key;
    await this.db.update(users).set({ ...patch, updatedAt: new Date() }).where(eq(users.id, userId));
    return true;
  }

  // Fusion
  async getFusion(userId: string) {
    return this.db.query.fusions.findFirst({
      where: (f, { or, eq: e }) => or(e(f.userA, userId), e(f.userB, userId)),
    });
  }

  async partnerOf(userId: string): Promise<string | null> {
    const f = await this.getFusion(userId);
    if (!f) return null;
    return f.userA === userId ? f.userB : f.userA;
  }

  async createFusion(a: string, b: string) {
    const [userA, userB] = [a, b].toSorted();
    await this.db.insert(fusions).values({ userA, userB }).onConflictDoNothing();
  }

  async breakFusion(userId: string) {
    const f = await this.getFusion(userId);
    if (!f) return false;
    await this.db.delete(fusions).where(eq(fusions.id, f.id));
    return true;
  }

  async listAllFusions() {
    return this.db.select().from(fusions);
  }

  // Succès
  async grantAchievement(userId: string, code: string): Promise<boolean> {
    await this.ensureUser(userId);
    try {
      await this.db.insert(achievements).values({ userId, code });
      return true;
    } catch {
      return false; // déjà attribué
    }
  }

  async revokeAchievement(userId: string, code: string) {
    await this.db.delete(achievements).where(and(eq(achievements.userId, userId), eq(achievements.code, code)));
  }

  async listAchievements(userId: string) {
    return this.db.select().from(achievements).where(eq(achievements.userId, userId));
  }

  // Classements
  async topRich(limit = 10) {
    return this.db.select().from(users).orderBy(desc(users.zeni)).limit(limit);
  }

  async listRegisteredIds(): Promise<string[]> {
    const rows = await this.db.select({ id: users.id }).from(users);
    return rows.map((r) => r.id);
  }
}
