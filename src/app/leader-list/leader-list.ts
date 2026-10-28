
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GymLeaderService } from '../gym-leader';
import { REGIONS } from '../gym-leader.model';
import { LeaderCard } from '../leader-card/leader-card';

@Component({
  selector: 'app-leader-list',
  standalone: true,
  imports: [LeaderCard],
  templateUrl: './leader-list.html',
  styleUrl: './leader-list.css'
})
export class LeaderList implements OnInit {
  leaderService = inject(GymLeaderService);
  private router = inject(Router);

  regions = ['All', ...REGIONS];
  selectedRegion = signal('All');
  message = signal('');

  filteredLeaders = computed(() => {
    const region = this.selectedRegion();
    const leaders = this.leaderService.leaders();

    if (region === 'All') {
      return leaders;
    }

    return leaders.filter((leader) => leader.region === region);
  });

  ngOnInit(): void {
    this.leaderService.fetchLeaders();
  }

  setRegion(region: string): void {
    this.selectedRegion.set(region);
  }

  editLeader(id: string): void {
    this.router.navigate(['/leaders', id, 'edit']);
  }

  deleteLeader(id: string): void {
    const leader = this.leaderService.leaders().find(
      (item) => item._id === id
    );

    if (!leader) {
      return;
    }

    if (!confirm(`Remove ${leader.name} from the registry?`)) {
      return;
    }

    this.leaderService.deleteLeader(id).subscribe({
      next: () => {
        this.message.set(`${leader.name} was removed.`);
        this.leaderService.fetchLeaders();
      },
      error: () => {
        this.message.set(`Failed to remove ${leader.name}.`);
      }
    });
  }
}
