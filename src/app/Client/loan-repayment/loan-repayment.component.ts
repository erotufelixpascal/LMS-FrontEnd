import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { ClientNavbarComponent } from '../client-navbar/client-navbar.component';
import { CommonService } from '../../Services/common.service';
import { Loan, RepaymentSchedule } from '../../Services/models/api.models';

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
  loanRepaymentForm: FormGroup;

  loans: Loan[] = [];
  schedule: RepaymentSchedule[] = [];

  loadingLoans = false;
  loadingSchedule = false;
  submitting = false;
  submitError: string | null = null;
  submitSuccess: string | null = null;

  constructor(private fb: FormBuilder, private datePipe: DatePipe, private dataService: CommonService) {
    this.currentDateTime = this.datePipe.transform(new Date(), 'fullDate') + ' ' + this.datePipe.transform(new Date(), 'shortTime');
      this.loanRepaymentForm = this.fb.group({
        loanId: ['', Validators.required],
        scheduleId: ['', Validators.required],
        amount: ['', [Validators.required, Validators.min(1)]],
        method: ['', Validators.required]
      });
  }

  ngOnInit(): void {
    this.loadingLoans = true;
    this.dataService.getLoans().subscribe({
      next: (data) => {
        this.loans = data;
        this.loadingLoans = false;
      },
      error: () => {
        this.loadingLoans = false;
      }
    });
  }

  get selectedScheduleRow(): RepaymentSchedule | undefined {
    const scheduleId = Number(this.loanRepaymentForm.get('scheduleId')?.value);
    return this.schedule.find((row) => row.id === scheduleId);
  }

  onLoanChange(): void {
    const loanId = Number(this.loanRepaymentForm.get('loanId')?.value);
    this.schedule = [];
    this.loanRepaymentForm.get('scheduleId')?.setValue('');
    if (!loanId) {
      return;
    }
    this.loadingSchedule = true;
    this.dataService.getLoanSchedule(loanId).subscribe({
      next: (data) => {
        this.schedule = data;
        this.loadingSchedule = false;
      },
      error: () => {
        this.loadingSchedule = false;
      }
    });
  }

  onSubmit(): void {
    if (this.loanRepaymentForm.invalid) {
      return;
    }

    this.submitError = null;
    this.submitSuccess = null;
    this.submitting = true;

    const formValue = this.loanRepaymentForm.value;
    this.dataService.makePayment({
      loanId: Number(formValue.loanId),
      scheduleId: Number(formValue.scheduleId),
      amountPaid: Number(formValue.amount),
      method: formValue.method
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.submitSuccess = 'Payment submitted successfully.';
        this.loanRepaymentForm.reset();
        this.schedule = [];
      },
      error: (error) => {
        this.submitting = false;
        this.submitError = error?.error?.message || 'Failed to submit payment. Please try again.';
      }
    });
  }

}
