
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GymLeaderService } from '../gym-leader';
import { POKEMON_TYPES, REGIONS } from '../gym-leader.model';

@Component({
  selector: 'app-leader-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './leader-form.html',
  styleUrl: './leader-form.css'
})
export class LeaderForm implements OnInit {
  leaderService = inject(GymLeaderService);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  regions = REGIONS;
  types = POKEMON_TYPES;

  editingId: string | null = null;
  message = signal('');
  isLoading = signal(false);

  leaderForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    region: ['', Validators.required],
    town: ['', Validators.required],
    badge: ['', Validators.required],
    specialty: ['', Validators.required],
    aceLevel: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
    motto: ['', Validators.maxLength(150)]
  });

  ngOnInit(): void {
    this.editingId = this.route.snapshot.paramMap.get('id');

    if (this.editingId) {
      this.isLoading.set(true);

      this.leaderService.getLeader(this.editingId).subscribe({
        next: (leader) => {
          this.leaderForm.patchValue({
            name: leader.name,
            region: leader.region,
            town: leader.town,
            badge: leader.badge,
            specialty: leader.specialty,
            aceLevel: leader.aceLevel
          });

          this.isLoading.set(false);
        },
        error: () => {
          this.message.set('Could not load this Gym Leader.');
          this.isLoading.set(false);
        }
      });
    }
  }

  isInvalid(field: 'name' | 'region' | 'town' | 'badge' | 'specialty' | 'aceLevel'): boolean {
    const control = this.leaderForm.controls[field];
    return control.touched && control.invalid;
  }

  saveLeader(): void {
    if (this.leaderForm.invalid) {
      this.leaderForm.markAllAsTouched();
      return;
    }

    const data = this.leaderForm.getRawValue();

    if (this.editingId) {
      this.leaderService.updateLeader(this.editingId, data).subscribe({
        next: () => {
          this.router.navigate(['/leaders']);
        },
        error: () => {
          this.message.set('Failed to update Gym Leader.');
        }
      });
    } else {
      this.leaderService.addLeader(data).subscribe({
        next: () => {
          this.router.navigate(['/leaders']);
        },
        error: () => {
          this.message.set('Failed to add Gym Leader.');
        }
      });
    }
  }

  cancelEdit(): void {
    this.router.navigate(['/leaders']);
  }
}
