import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup ,Validators} from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { ClientNavbarComponent } from '../client-navbar/client-navbar.component';


@Component({
    selector: 'app-loan-repayment',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatTabsModule,
        ClientNavbarComponent
 
    ],
    providers: [DatePipe],
    templateUrl: './loan-repayment.component.html',
    styleUrl: './loan-repayment.component.scss'
})
export class LoanRepaymentComponent implements OnInit {
  currentDateTime: string;
  loanRepaymentForm:FormGroup

  constructor(private fb:FormBuilder, private datePipe: DatePipe){
    this.currentDateTime = this.datePipe.transform(new Date(), 'fullDate') + ' ' + this.datePipe.transform(new Date(), 'shortTime');
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
