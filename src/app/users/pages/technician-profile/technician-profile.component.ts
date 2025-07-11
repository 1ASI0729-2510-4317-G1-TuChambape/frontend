import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WorkerService } from '../../services/worker.service';
import { Worker } from '../../model/worker.entity';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-technician-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './technician-profile.component.html',
  styleUrls: ['./technician-profile.component.css']
})
export class TechnicianProfileComponent implements OnInit {
  worker: Worker | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private workerService: WorkerService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (!id) {
        this.error = 'Technician ID not provided';
        this.isLoading = false;
        return;
      }
      this.workerService.getWorkerById(id).subscribe({
        next: (worker) => {
          this.worker = worker;
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Could not load technician information';
          this.isLoading = false;
        }
      });
    });
  }
} 