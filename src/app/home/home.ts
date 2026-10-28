
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GymLeaderService } from '../gym-leader';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  leaderService = inject(GymLeaderService);

  ngOnInit(): void {
    this.leaderService.fetchLeaders();
  }
}
