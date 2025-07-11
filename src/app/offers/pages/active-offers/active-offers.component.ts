import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../model/offer.entity';
import { OffersSessionService } from '../../services/session.service';
import { OfferStatus } from '../../services/top-headlines.response';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-active-offers',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './active-offers.component.html',
  styleUrls: ['./active-offers.component.css']
})
export class ActiveOffersComponent implements OnInit {
  activeOffers: Offer[] = [];
  isLoading: boolean = false;
  
  // Columnas para la tabla de Material
  displayedColumns: string[] = ['title', 'description', 'budget', 'createdDate', 'actions'];

  constructor(
    private offerService: OfferService,
    private session: OffersSessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadActiveOffers();
  }

  loadActiveOffers(): void {
    this.isLoading = true;
    const currentAccount = this.session.getCurrentAccount();
    if (!currentAccount) {
      this.isLoading = false;
      return;
    }
    
    this.offerService.getOffersByStatus(currentAccount.id.toString(), OfferStatus.ACTIVE).subscribe({
      next: (offers) => {
        this.activeOffers = offers;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  viewOfferDetails(offer: Offer): void {
    this.router.navigate(['/dashboard', 'ofertas', offer.id]);
  }

  // Método para formatear la descripción en la tabla
  getShortDescription(description: string): string {
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  }

  // Método para formatear el presupuesto
  getBudgetRange(offer: Offer): string {
    if (offer.budget.min && offer.budget.max) {
      return `S/ ${offer.budget.min} - S/ ${offer.budget.max}`;
    } else if (offer.budget.min) {
      return `S/ ${offer.budget.min}+`;
    } else if (offer.budget.max) {
      return `Hasta S/ ${offer.budget.max}`;
    }
    return 'No especificado';
  }

  // Método para formatear la fecha
  getFormattedDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
