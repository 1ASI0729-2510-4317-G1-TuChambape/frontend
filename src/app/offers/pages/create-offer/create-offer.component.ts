import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../model/offer.entity';
import { OfferStatus } from '../../services/top-headlines.response';
import { OffersSessionService } from '../../services/session.service';

// Angular Material Imports para la sección de presupuesto
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-offer',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.css']
})
export class CreateOfferComponent implements OnInit {

  offerForm: FormGroup;

  categories: string[] = ['Electricista', 'Plomero', 'Desarrollador Web', 'Diseñador Gráfico', 'Niñera'];
  experienceLevels: string[] = ['Sin experiencia', 'Menos de 1 año', '1-2 años', '3-5 años', 'Más de 5 años'];
  workHourOptions: string[] = ['Medio Tiempo (Mañana)', 'Medio Tiempo (Tarde)', 'Tiempo Completo', 'Flexible', 'Por Horas'];
  paymentMethods: string[] = ['Transferencia Bancaria', 'Efectivo', 'Yape/Plin', 'Otro'];

  formErrors: any = {};
  generalError: string | null = null;
  successMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private offerService: OfferService,
    private session: OffersSessionService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.offerForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      category: ['', Validators.required],
      address: ['', Validators.required],
      languagesRequired: [''],
      minExperience: ['', Validators.required],
      certificationsNeeded: [''],
      workHours: [''],
      estimatedBudgetMin: [0, [Validators.required, Validators.min(0)]],
      estimatedBudgetMax: [0, [Validators.required, Validators.min(0)]],
      estimatedBudgetCurrency: ['PEN', Validators.required],
      paymentMethod: ['', Validators.required],
      acceptNotifications: [false],
      authorizeDataProcessing: [false, Validators.requiredTrue],
      deadline: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Validación personalizada para el presupuesto
    this.offerForm.get('estimatedBudgetMax')?.valueChanges.subscribe(maxValue => {
      const minValue = this.offerForm.get('estimatedBudgetMin')?.value;
      if (maxValue && minValue && maxValue < minValue) {
        this.offerForm.get('estimatedBudgetMax')?.setErrors({ invalidRange: true });
      }
    });

    this.offerForm.get('estimatedBudgetMin')?.valueChanges.subscribe(minValue => {
      const maxValue = this.offerForm.get('estimatedBudgetMax')?.value;
      if (minValue && maxValue && minValue > maxValue) {
        this.offerForm.get('estimatedBudgetMin')?.setErrors({ invalidRange: true });
      }
    });
  }

  onSubmit(): void {
    if (this.offerForm.invalid) {
      this.markFormGroupTouched();
      this.generalError = 'Por favor, corrija los errores en el formulario.';
      return;
    }

    this.isLoading = true;
    this.formErrors = {};
    this.generalError = null;
    this.successMessage = null;

    const currentAccount = this.session.getCurrentAccount();
    if (!currentAccount) {
      this.generalError = 'No hay usuario autenticado.';
      this.isLoading = false;
      return;
    }

    const formValue = this.offerForm.value;
    const offerData: Omit<Offer, 'id'> = {
      title: formValue.title,
      description: formValue.description,
      clientId: currentAccount.id,
      clientEmail: currentAccount.email,
      status: OfferStatus.ACTIVE,
      category: formValue.category,
      location: formValue.address,
      budget: {
        min: formValue.estimatedBudgetMin,
        max: formValue.estimatedBudgetMax,
        currency: formValue.estimatedBudgetCurrency
      },
      requirements: [
        formValue.languagesRequired,
        formValue.minExperience,
        formValue.certificationsNeeded,
        formValue.workHours
      ].filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date(),
      deadline: formValue.deadline,
      proposalsCount: 0
    };

    this.offerService.createOffer(offerData, currentAccount.id, currentAccount.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = '¡Oferta creada con éxito!';
        
        this.resetForm();
        this.router.navigate(['/dashboard/ofertas/activas']);
      },
      error: () => {
        this.isLoading = false;
        this.generalError = 'Error al crear la oferta.';
      }
    });
  }

  resetForm(): void {
    this.offerForm.reset({
      estimatedBudgetCurrency: 'PEN',
      acceptNotifications: false,
      authorizeDataProcessing: false
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.offerForm.controls).forEach(key => {
      const control = this.offerForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.offerForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido.';
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `Mínimo ${requiredLength} caracteres.`;
    }
    if (control?.hasError('min')) {
      return 'El valor debe ser mayor a 0.';
    }
    if (control?.hasError('invalidRange')) {
      return 'El valor máximo debe ser mayor al mínimo.';
    }
    if (control?.hasError('requiredTrue')) {
      return 'Debe autorizar el tratamiento de datos.';
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.offerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Métodos para manejar los sliders de presupuesto
  onBudgetSliderChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    
    if (target.id === 'budgetSliderMin') {
      const maxValue = this.offerForm.get('estimatedBudgetMax')?.value || 1000;
      if (value <= maxValue) {
        this.offerForm.patchValue({ estimatedBudgetMin: value });
      }
    } else if (target.id === 'budgetSliderMax') {
      const minValue = this.offerForm.get('estimatedBudgetMin')?.value || 0;
      if (value >= minValue) {
        this.offerForm.patchValue({ estimatedBudgetMax: value });
      }
    }
  }

  getBudgetRangeStyles(): any {
    const minValue = this.offerForm.get('estimatedBudgetMin')?.value || 0;
    const maxValue = this.offerForm.get('estimatedBudgetMax')?.value || 1000;
    const minPercent = (minValue / 10000) * 100;
    const maxPercent = (maxValue / 10000) * 100;
    
    return {
      '--min-percent': minPercent + '%',
      '--max-percent': maxPercent + '%'
    };
  }

  getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}