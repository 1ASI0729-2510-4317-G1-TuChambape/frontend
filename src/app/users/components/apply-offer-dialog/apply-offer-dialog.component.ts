import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-apply-offer-dialog',
  templateUrl: './apply-offer-dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, CommonModule]
})
export class ApplyOfferDialogComponent implements OnInit {
  message: string = '';
  price: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<ApplyOfferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.proposal) {
      this.message = this.data.proposal.message;
      this.price = this.data.proposal.price;
    }
  }

  submit() {
    if (this.message && this.price) {
      this.dialogRef.close({ message: this.message, price: this.price });
    }
  }
} 