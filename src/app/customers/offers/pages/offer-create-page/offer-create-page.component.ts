import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { OfferService } from '../../services/offer.service';
import { Router } from '@angular/router';
import { Offer } from '../../model/offer.entity';

interface SelectItem {
  label: string;
  value: any;
}

@Component({
  selector: 'app-offer-create-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule,
    CommonModule,
  ],
  templateUrl: './offer-create-page.component.html',
  styleUrls: ['./offer-create-page.component.css'],
})
export class OfferCreatePageComponent implements OnInit {
  offerForm!: FormGroup;
  private readonly offerService = inject(OfferService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  technicalCategories: SelectItem[] = [
    { label: 'Frontend', value: 'frontend' },
    { label: 'Backend', value: 'backend' },
    { label: 'Fullstack', value: 'fullstack' },
  ];

  experiences: SelectItem[] = [
    { label: 'Junior', value: 'junior' },
    { label: 'Semi Senior', value: 'semi_senior' },
    { label: 'Senior', value: 'senior' },
  ];

  workSchedules: SelectItem[] = [
    { label: '9am - 6pm', value: '9-18' },
    { label: 'Flexible', value: 'flexible' },
    { label: 'Turnos', value: 'shifts' },
  ];

  paymentMethods: SelectItem[] = [
    { label: 'Transferencia bancaria', value: 'transfer' },
    { label: 'Pago por hora', value: 'hourly' },
    { label: 'Pago fijo', value: 'fixed' },
  ];

  ngOnInit(): void {
    this.offerForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      technicalCategory: [null, Validators.required],
      location: [''],
      requiredExperience: [null],
      workSchedule: [null],
      estimatedBudget: [''],
      paymentMethod: [null],
      notificationsAccepted: [false],
      personalDataConsent: [false, Validators.requiredTrue],
    });
  }

  submitForm() {
    if (this.offerForm.invalid) {
      if (!this.offerForm.controls['personalDataConsent'].value) {
        alert('Debes aceptar el tratamiento de datos personales');
      }
      this.offerForm.markAllAsTouched();
      return;
    }

    const offer = new Offer({
      ...this.offerForm.value,
      userId: '1', // TODO: Cambiar por el ID del usuario logueado
      status: 'active',
    });

    this.offerService.create(offer).subscribe({
      next: () => {
        this.snackBar.open('Oferta creada con éxito', 'Cerrar', {
          duration: 3000,
        });
        this.router.navigate(['/customer/offers/list']);
      },
      error: () => {
        this.snackBar.open('Error al crear la oferta', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }
}
