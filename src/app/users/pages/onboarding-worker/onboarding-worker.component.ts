import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WorkerService } from '../../services/worker.service';
import { UserSessionService } from '../../services/user-session.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding-worker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './onboarding-worker.component.html',
  styleUrls: ['./onboarding-worker.component.css']
})
export class OnboardingWorkerComponent implements OnInit {
  form: FormGroup;
  success = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private workerService: WorkerService,
    private userSession: UserSessionService,
    private userService: UserService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      location: ['', Validators.required],
      bio: [''],
      skills: [''],
      experience: ['', Validators.required],
      certifications: ['']
    });
  }

  router = inject(Router);

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData() {
    const account = this.userSession.getCurrentAccount();
    if (account && account.name) {
      // Dividir el nombre completo en nombre y apellido
      const nameParts = account.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      this.form.patchValue({
        firstName: firstName,
        lastName: lastName
      });
    }
  }

  submit() {
    this.error = null;
    const account = this.userSession.getCurrentAccount();
    if (!account) {
      this.error = 'No session.';
      return;
    }
    const worker = {
      ...this.form.value,
      accountId: account.id,
      email: account.email,
      role: 'WORKER',
      profileType: 'INDIVIDUAL',
      rating: 0,
      reviewCount: 0,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    // skills y certifications como arrays
    if (typeof worker.skills === 'string') worker.skills = worker.skills.split(',').map((s: string) => s.trim());
    if (typeof worker.certifications === 'string') worker.certifications = worker.certifications.split(',').map((c: string) => c.trim());
    worker.experience = parseInt(worker.experience, 10);
    this.workerService.create(worker).subscribe({
      next: (createdWorker) => {
        this.userService.search({ accountId: account.id }).subscribe(users => {
          const user = users[0];
          if (user) {
            this.userService.update(user.id, { ...user, workerId: createdWorker.id }).subscribe(() => {
              this.router.navigate(['/dashboard']);
            });
          }
        });
        this.success = true;
      },
      error: () => this.error = 'Error creating worker.'
    });
  }
} 