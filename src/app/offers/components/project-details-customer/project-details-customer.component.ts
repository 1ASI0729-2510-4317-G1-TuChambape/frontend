import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Offer } from '../../model/offer.entity';
import { OfferProposalDto } from '../../model/offer-proposal.dto';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-project-details-customer',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './project-details-customer.component.html',
  styleUrls: ['./project-details-customer.component.css']
})
export class ProjectDetailsCustomerComponent {
  @Input() offer!: Offer;
  @Input() worker!: OfferProposalDto;
  @Input() location!: string;

  @Output() finalize = new EventEmitter<void>();
  @Output() chat = new EventEmitter<void>();

  onFinalize() {
    this.finalize.emit();
  }

  onChat() {
    this.chat.emit();
  }
}
