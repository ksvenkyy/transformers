import { Injectable, signal } from '@angular/core';

export type TvStatus = 'Idle' | 'Running' | 'Stopped';

export type Tv = {
  tvNo: number;
  consoleType: string;
  peopleCount: 1 | 2 | 3 | 4;
  status: TvStatus;
  startedAtMs: number | null;
  elapsedSeconds: number;
  billedAmountRs: number;
};

@Injectable({ providedIn: 'root' })
export class TvService {
  private readonly _tvs = signal<Tv[]>(this.createInitialTvs());
  readonly tvs = this._tvs.asReadonly();

  // Ticks so the UI can show a live timer.
  private readonly _nowMs = signal(Date.now());
  readonly nowMs = this._nowMs.asReadonly();

  constructor() {
    setInterval(() => this._nowMs.set(Date.now()), 1000);
  }

  private createInitialTvs(): Tv[] {
    return [1, 2, 3, 4, 5, 6, 7].map((tvNo) => ({
      tvNo,
      consoleType: 'PS2',
      peopleCount: 1,
      status: 'Idle',
      startedAtMs: null,
      elapsedSeconds: 0,
      billedAmountRs: 0,
    }));
  }

  updateConfig(tvNo: number, consoleType: string, peopleCount: 1 | 2 | 3 | 4): void {
    this._tvs.set(
      this._tvs().map((t) =>
        t.tvNo === tvNo
          ? { ...t, consoleType: consoleType.trim(), peopleCount }
          : t,
      ),
    );
  }

  upsertTv(tvNo: number, consoleType: string, peopleCount: 1 | 2 | 3 | 4): Tv {
    const cleanedConsole = consoleType.trim();
    const existing = this._tvs().find((t) => t.tvNo === tvNo);

    const next: Tv = {
      tvNo,
      consoleType: cleanedConsole,
      peopleCount,
      status: existing?.status ?? 'Idle',
      startedAtMs: existing?.startedAtMs ?? null,
      elapsedSeconds: existing?.elapsedSeconds ?? 0,
      billedAmountRs: existing?.billedAmountRs ?? 0,
    };

    this._tvs.set([
      ...this._tvs().filter((t) => t.tvNo !== tvNo),
      next,
    ].sort((a, b) => a.tvNo - b.tvNo));

    return next;
  }

  start(tvNo: number): void {
    this._tvs.set(
      this._tvs().map((t) =>
        t.tvNo === tvNo
          ? {
              ...t,
              status: 'Running',
              startedAtMs: Date.now(),
              elapsedSeconds: 0,
              billedAmountRs: 0,
            }
          : t,
      ),
    );
  }

  stop(tvNo: number): void {
    this._tvs.set(
      this._tvs().map((t) =>
        t.tvNo === tvNo ? this.stopOne(t) : t,
      ),
    );
  }

  reset(tvNo: number): void {
    this._tvs.set(
      this._tvs().map((t) =>
        t.tvNo === tvNo
          ? {
              ...t,
              status: 'Idle',
              startedAtMs: null,
              elapsedSeconds: 0,
              billedAmountRs: 0,
            }
          : t,
      ),
    );
  }

  private stopOne(tv: Tv): Tv {
    const elapsedSeconds = this.getElapsedSeconds(tv);
    const rate = this.getRatePerHour(tv.consoleType, tv.peopleCount);
    const hours = elapsedSeconds / 3600;
    const billedAmountRs = Math.ceil(hours * rate);

    return {
      ...tv,
      status: 'Stopped',
      elapsedSeconds,
      billedAmountRs,
      startedAtMs: null,
    };
  }

  getRatePerHour(consoleType: string, peopleCount: 1 | 2 | 3 | 4): number {
    const normalized = consoleType.trim().toLowerCase().replace(/\s+/g, '');
    if (normalized === 'ps2') {
      if (peopleCount === 1) return 30;
      if (peopleCount === 2) return 50;
      if (peopleCount === 3) return 60;
      return 80;
    }
    if (normalized === 'ps4') {
      if (peopleCount === 1) return 50;
      if (peopleCount === 2) return 80;
      if (peopleCount === 3) return 110;
      return 150;
    }
    if (normalized === 'ps5') {
      if (peopleCount === 1) return 60;
      if (peopleCount === 2) return 100;
      if (peopleCount === 3) return 135;
      return 160;
    }
    return 0;
  }

  getAmountRs(tv: Tv): number {
    const rate = this.getRatePerHour(tv.consoleType, tv.peopleCount);
    if (!rate) return 0;

    const elapsedSeconds = this.getElapsedSeconds(tv);
    const hours = elapsedSeconds / 3600;
    return Math.ceil(hours * rate);
  }

  getElapsedSeconds(tv: Tv): number {
    if (tv.status !== 'Running' || !tv.startedAtMs) return tv.elapsedSeconds;
    const running = Math.max(
      0,
      Math.floor((this._nowMs() - tv.startedAtMs) / 1000),
    );
    return tv.elapsedSeconds + running;
  }
}

