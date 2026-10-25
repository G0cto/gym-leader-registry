import { HttpClient } from "@angular/common/http";
import { computed, inject, Service, signal} from '@angular/core';
import { Observable } from "rxjs";
import { DeleteResponse,GymLeader } from "./gym-leader.models";

@Service()
export class GymLeaderService {
    private readonly http = inject(HttpClient);
    private readonly apiURL = 'http://localhost:3000/api/leaders';

    readonly leaders = signal<GymLeader[]>([]);
    readonly loading = signal(false);
    readonly loadError = signal('');
    
    readonly kantoCount = computed(() => this.leaders().filter((l) => l.region === 'Kanto').length);
    readonly johtoCount = computed(() => this.leaders().filter((l) => l.region === 'Johto').length);
    readonly hoennCount = computed(() => this.leaders().filter((l) => l.region === 'hoenn').length);

    fetchLeaders(): void {
        this.loading.set(true);
        this.loadError.set('');
        this.http.get<GymLeader[]>(this.apiURL).subscribe({
            next: (data) => {
                this.leaders.set(data);
                this.loading.set(false);
            },
            error: () => {
                this.loadError.set('Could no load Gym Leaders. Kindly check backend server');
                this.loading.set(false);
            }
        });
    }

    getLeader(id: String): Observable<GymLeader> {
        return this.http.get<GymLeader>(`${this.apiURL}/${id}`);
    }

    addLeader(leader: GymLeader): Observable<GymLeader> {
        return this.http.post<GymLeader>(this.apiURL, leader);
    }
    updateLeader(id: string, leader: GymLeader): Observable<GymLeader> {
        return this.http.put<GymLeader>(`${this.apiURL}/${id}`, leader);
    }
    deleteLeader(id: string): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiURL}/${id}`);
  }
}