import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para [(ngModel)]
import { Router, RouterModule } from '@angular/router'; // Router para navegación
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../model/offer.entity';
import { OfferStatus } from '../../services/top-headlines.response';
import { OffersSessionService } from '../../services/session.service';

// Interfaz para la oferta de trabajo
interface OfferForm {
  title: string;
  description: string;
  category: string;
  address: string;
  languagesRequired: string;
  minExperience: string;
  certificationsNeeded: string;
  workHours: string;
  estimatedBudgetMin: number;
  estimatedBudgetMax: number;
  estimatedBudgetCurrency: string;
  paymentMethod: string;
  acceptNotifications: boolean;
  authorizeDataProcessing: boolean;
  deadline: string;
}

@Component({
  selector: 'app-create-offer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.css']
})
export class CreateOfferComponent implements OnInit {

  newOffer: OfferForm = {
    title: '',
    description: '',
    category: '',
    address: '',
    languagesRequired: '',
    minExperience: '',
    certificationsNeeded: '',
    workHours: '',
    estimatedBudgetMin: 0,
    estimatedBudgetMax: 0,
    estimatedBudgetCurrency: 'PEN',
    paymentMethod: '',
    acceptNotifications: false,
    authorizeDataProcessing: false,
    deadline: ''
  };

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
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.isLoading = true;
    this.formErrors = {};
    this.generalError = null;
    this.successMessage = null;

    if (!this.newOffer.title) this.formErrors.title = 'El título de la oferta es requerido.';
    if (!this.newOffer.description) this.formErrors.description = 'La descripción es requerida.';
    if (!this.newOffer.category) this.formErrors.category = 'La categoría es requerida.';
    if (!this.newOffer.address) this.formErrors.address = 'La dirección es requerida.';
    if (!this.newOffer.minExperience) this.formErrors.minExperience = 'La experiencia mínima es requerida.';
    if (!this.newOffer.estimatedBudgetMin || !this.newOffer.estimatedBudgetMax) this.formErrors.estimatedBudget = 'El presupuesto es requerido.';
    if (!this.newOffer.paymentMethod) this.formErrors.paymentMethod = 'La forma de pago es requerida.';
    if (!this.newOffer.authorizeDataProcessing) this.formErrors.authorizeDataProcessing = 'Debe autorizar el tratamiento de datos.';

    if (Object.keys(this.formErrors).length > 0) {
      this.generalError = 'Por favor, corrija los errores en el formulario.';
      this.isLoading = false;
      return;
    }

    const currentAccount = this.session.getCurrentAccount();
    if (!currentAccount) {
      this.generalError = 'No hay usuario autenticado.';
      this.isLoading = false;
      return;
    }

    const offerData: Omit<Offer, 'id'> = {
      title: this.newOffer.title,
      description: this.newOffer.description,
      clientId: currentAccount.id,
      clientEmail: currentAccount.email,
      status: OfferStatus.DRAFT,
      category: this.newOffer.category,
      location: this.newOffer.address,
      budget: {
        min: this.newOffer.estimatedBudgetMin,
        max: this.newOffer.estimatedBudgetMax,
        currency: this.newOffer.estimatedBudgetCurrency
      },
      requirements: [
        this.newOffer.languagesRequired,
        this.newOffer.minExperience,
        this.newOffer.certificationsNeeded,
        this.newOffer.workHours
      ].filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date(),
      deadline: this.newOffer.deadline,
      proposalsCount: 0
    };

    this.offerService.createOffer(offerData, currentAccount.id, currentAccount.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = '¡Oferta creada con éxito!';
        this.resetForm();
        setTimeout(() => {
          if (this.successMessage) {
            this.router.navigate(['/client/ofertas/activas']);
          }
        }, 2000);
      },
      error: () => {
        this.generalError = 'Error al crear la oferta.';
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.newOffer = {
      title: '', description: '', category: '', address: '', languagesRequired: '', minExperience: '', certificationsNeeded: '', workHours: '', estimatedBudgetMin: 0, estimatedBudgetMax: 0, estimatedBudgetCurrency: 'PEN', paymentMethod: '', acceptNotifications: false, authorizeDataProcessing: false, deadline: ''
    };
    this.formErrors = {};
    this.generalError = null;
  }
}
