import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup ,Validators} from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'app-loan-repayment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    AgGridModule,
  ],
  templateUrl: './loan-repayment.component.html',
  styleUrl: './loan-repayment.component.scss'
})
export class LoanRepaymentComponent implements OnInit {
  loanRepaymentForm:FormGroup

  constructor(private fb:FormBuilder){
      this.loanRepaymentForm = this.fb.group({
        loanId: ['', Validators.required],
        amountDue:['', [Validators.required, Validators.min(1)]],
        amount: ['', [Validators.required, Validators.min(1)]],
        repaymentDate: ['', Validators.required]
      })
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loanRepaymentForm.valid) {
      const repaymentDetails = this.loanRepaymentForm.value;
      console.log('Repayment Details:', repaymentDetails);
      // Add your logic to handle the form submission, such as sending data to a server
    }
  }

}
