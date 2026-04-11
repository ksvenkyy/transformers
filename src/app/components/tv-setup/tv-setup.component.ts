import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TvService } from '../../services/tv.service';

@Component({
  selector: 'app-tv-setup',
  imports: [FormsModule, RouterLink],
  templateUrl: './tv-setup.component.html',
})
export class TvSetupComponent {
  protected tvNo: number | null = null;
  protected consoleType: 'PS2' | 'PS4' | 'PS5' | '' = '';
  protected peopleCount: 1 | 2 | 3 | 4 | null = null;
  protected message = '';

  protected readonly tvNoOptions = [1, 2, 3, 4, 5, 6, 7] as const;
  protected readonly consoleOptions = ['PS2', 'PS4', 'PS5'] as const;
  protected readonly peopleOptions = [1, 2, 3, 4] as const;

  constructor(
    private readonly tvs: TvService,
    private readonly router: Router,
  ) { }

  protected onStart(): void {
    const tvNo = this.tvNo ?? NaN;
    if (!Number.isFinite(tvNo) || tvNo <= 0) {
      this.message = 'Please enter a valid Tv no.';
      return;
    }
    if (!this.consoleType) {
      this.message = 'Please select the type of console.';
      return;
    }
    if (!this.peopleCount) {
      this.message = 'Please select no. of people.';
      return;
    }

    this.tvs.upsertTv(tvNo, this.consoleType, this.peopleCount);
    this.tvs.start(tvNo);
    this.message = '';
    void this.router.navigateByUrl('/dashboard');
  }
}

