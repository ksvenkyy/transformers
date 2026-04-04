import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Tv, TvService, TvStatus } from '../tv.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, FormsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private readonly tvsService = inject(TvService);
  protected readonly tvs = this.tvsService.tvs;

  // Touch `nowMs` so the template updates once a second when running.
  protected readonly _tick = computed(() => this.tvsService.nowMs());

  protected badgeClass(status: TvStatus): string {
    switch (status) {
      case 'Running':
        return 'gs-badge-pill gs-badge-pill--online';
      case 'Stopped':
        return 'gs-badge-pill gs-badge-pill--offline';
      case 'Idle':
        return 'gs-badge-pill gs-badge-pill--idle';
    }
  }

  protected statusText(tv: Tv): string {
    const secs = this.tvsService.getElapsedSeconds(tv);
    if (tv.status === 'Running') return `Running (${this.formatDuration(secs)})`;
    if (tv.status === 'Stopped') return `Stopped (${this.formatDuration(secs)})`;
    return 'Not Running';
  }

  protected readonly consoleOptions = ['PS2', 'PS4', 'PS5'] as const;
  protected readonly peopleOptions = [1, 2, 3, 4] as const;

  protected onConsoleChange(tv: Tv, value: string): void {
    this.tvsService.updateConfig(tv.tvNo, value, tv.peopleCount);
  }

  protected onPeopleChange(tv: Tv, value: 1 | 2 | 3 | 4): void {
    this.tvsService.updateConfig(tv.tvNo, tv.consoleType, value);
  }

  protected start(tvNo: number): void {
    this.tvsService.start(tvNo);
  }

  protected stop(tvNo: number): void {
    this.tvsService.stop(tvNo);
  }

  protected reset(tvNo: number): void {
    this.tvsService.reset(tvNo);
  }

  protected amountRs(tv: Tv): number {
    return tv.status === 'Stopped' ? tv.billedAmountRs : this.tvsService.getAmountRs(tv);
  }

  protected formatDuration(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
}

