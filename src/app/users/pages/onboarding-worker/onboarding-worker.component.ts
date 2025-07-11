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
      avatar: [''],
      location: ['', Validators.required],
      bio: [''],
      skills: [''],
      experience: ['', Validators.required],
      certifications: [''],
      availability: this.fb.group({
        monday: [''],
        tuesday: [''],
        wednesday: [''],
        thursday: [''],
        friday: [''],
        saturday: [''],
        sunday: ['']
      }),
      yapeNumber: [''],
      plinNumber: [''],
      bankAccountNumber: ['']
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

    const formValue = this.form.value;
    const workerPayload = {
      accountId: account.id,
      email: account.email,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phone: formValue.phone,
      avatar: formValue.avatar,
      location: formValue.location,
      bio: formValue.bio,
      skills: (typeof formValue.skills === 'string' && formValue.skills)
        ? formValue.skills.split(',').map((s: string) => s.trim())
        : [],
      experience: parseInt(formValue.experience, 10) || 0,
      certifications: (typeof formValue.certifications === 'string' && formValue.certifications)
        ? formValue.certifications.split(',').map((c: string) => c.trim())
        : [],
      availability: formValue.availability,
      yapeNumber: formValue.yapeNumber,
      plinNumber: formValue.plinNumber,
      bankAccountNumber: formValue.bankAccountNumber
    };

    this.workerService.create(workerPayload, this.userSession.getCurrentToken()!).subscribe({
      next: (createdWorker) => {
        this.userService.getUserByAccountId(account.id).subscribe(user => {
          if (user) {
            this.userService.update(user.id, { ...user, worker: createdWorker }).subscribe(() => {
              this.router.navigate(['/worker-dashboard']);
            });
          }
        });
        this.success = true;
      },
      error: () => this.error = 'Error creating worker.'
    });
  }
} 