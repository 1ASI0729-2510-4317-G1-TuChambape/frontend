import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import { UserSessionService } from '../../services/user-session.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './onboarding-customer.component.html',
  styleUrls: ['./onboarding-customer.component.css']
})
export class OnboardingCustomerComponent implements OnInit {
  form: FormGroup;
  success = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private userSession: UserSessionService,
    private userService: UserService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      location: ['', Validators.required],
      bio: ['']
    });
  }

  router = inject(Router);

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData() {
    const account = this.userSession.getCurrentAccount();
    console.log(account)
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
    const customer = {
      ...this.form.value,
      accountId: account.id,
      email: account.email,
      role: 'client',
      profileType: 'INDIVIDUAL',
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.customerService.createCustomer(customer).subscribe({
      next: (createdCustomer) => {
        this.userService.search({ accountId: account.id }).subscribe(users => {
          const user = users[0];
          if (user) {
            this.userService.update(user.id, { ...user, customerId: createdCustomer.id }).subscribe(() => {
              this.router.navigate(['/dashboard']);
            });
          }
        });
        this.success = true;
      },
      error: () => this.error = 'Error creating customer.'
    });
  }
} 