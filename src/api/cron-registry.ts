import { container, singleton } from "tsyringe";
import { logger } from "~/lib/logger";
import { EventBusService } from "~/services/EventBusService";

/**
 * Registry centralisée des jobs périodiques (équivalent `@Schedule` de tscord).
 *
 * Permet au dashboard d'inspecter et de déclencher manuellement les tâches qui
 * tournent en arrière-plan (XP vocal tick, scan bio role, jail expiry, …).
 *
 * Usage :
 *   1. À l'init du service : `cron.register({ name: "jail-expiry", intervalMs: 60_000, fn: () => this.tick() })`
 *   2. Le registry démarre le `setInterval` (avec `.unref()`).
 *   3. Stocke `lastRunAt`, `lastDurationMs`, `runCount`, `lastError`.
 *   4. `/cron` GET les expose ; `/cron/:name/trigger` POST déclenche manuellement.
 */

export interface CronJob {
  name: string;
  intervalMs: number;
  fn: () => Promise<void> | void;
  description?: string;
}

interface JobState extends CronJob {
  lastRunAt: number | null;
  lastDurationMs: number | null;
  runCount: number;
  lastError: string | null;
  timer: ReturnType<typeof setInterval> | null;
}

@singleton()
export class CronRegistry {
  private jobs = new Map<string, JobState>();

  register(job: CronJob): void {
    if (this.jobs.has(job.name)) {
      logger.warn({ name: job.name }, "CronRegistry: job déjà enregistré, skip");
      return;
    }
    const state: JobState = {
      ...job,
      lastRunAt: null,
      lastDurationMs: null,
      runCount: 0,
      lastError: null,
      timer: null,
    };
    state.timer = setInterval(() => this.run(job.name), job.intervalMs);
    state.timer.unref();
    this.jobs.set(job.name, state);
    logger.debug({ name: job.name, intervalMs: job.intervalMs }, "cron registered");
  }

  async run(name: string): Promise<{ ok: boolean; durationMs: number; error: string | null }> {
    const job = this.jobs.get(name);
    if (!job) return { ok: false, durationMs: 0, error: "job inconnu" };
    const t0 = performance.now();
    try {
      await job.fn();
      const duration = Math.round(performance.now() - t0);
      job.lastRunAt = Date.now();
      job.lastDurationMs = duration;
      job.runCount++;
      job.lastError = null;
      container.resolve(EventBusService).emit("cron:run", { name, ok: true, durationMs: duration });
      return { ok: true, durationMs: duration, error: null };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      job.lastRunAt = Date.now();
      job.lastDurationMs = Math.round(performance.now() - t0);
      job.runCount++;
      job.lastError = msg;
      logger.warn({ err, name }, "cron job failed");
      container
        .resolve(EventBusService)
        .emit("cron:run", { name, ok: false, durationMs: job.lastDurationMs });
      return { ok: false, durationMs: job.lastDurationMs, error: msg };
    }
  }

  list() {
    return [...this.jobs.values()].map((j) => ({
      name: j.name,
      description: j.description ?? null,
      intervalMs: j.intervalMs,
      lastRunAt: j.lastRunAt,
      lastDurationMs: j.lastDurationMs,
      runCount: j.runCount,
      lastError: j.lastError,
      nextRunAt: j.lastRunAt ? j.lastRunAt + j.intervalMs : null,
    }));
  }

  stopAll(): void {
    for (const j of this.jobs.values()) {
      if (j.timer) clearInterval(j.timer);
    }
    this.jobs.clear();
  }
}
