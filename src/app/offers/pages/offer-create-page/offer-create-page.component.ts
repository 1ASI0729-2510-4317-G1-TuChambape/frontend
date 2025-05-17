import { Component, OnInit } from '@angular/core';
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
  ],
  templateUrl: './offer-create-page.component.html',
  styleUrls: ['./offer-create-page.component.css'],
})
export class OfferCreatePageComponent implements OnInit {
  offerForm!: FormGroup;

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

  constructor(private fb: FormBuilder) {}

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
    console.log('Formulario enviado', this.offerForm.value);
    // Aquí envías el formulario a backend o lógica adicional
  }
}
