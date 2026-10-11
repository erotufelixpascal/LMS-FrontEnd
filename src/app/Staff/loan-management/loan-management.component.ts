import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';
import { StaffNavbarComponent } from '../staff-navbar/staff-navbar.component';
import { Loan, LoanApplication, Payment, RepaymentSchedule } from '../../Services/models/api.models';

interface LoanFile {
  fileName: string;
  fileType: string;
  uploadDate: Date;
}
interface Comment {
  userName: string;
  text: string;
  timestamp: Date;
}

@Component({
    selector: 'app-loan-management',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatTabsModule,
        StaffNavbarComponent,
        MatTooltipModule,
        MatTableModule
    ],
    providers: [DatePipe],
    templateUrl: './loan-management.component.html',
    styleUrl: './loan-management.component.scss'
})
export class LoanManagementComponent implements OnInit {
  staffForm: FormGroup;
  paymentForm: FormGroup;
  currentDateTime: string;
  gridApi: any;

  loans = signal<Loan[]>([]);
  selectedLoan = signal<Loan | null>(null);
  loanSchedule = signal<RepaymentSchedule[]>([]);
  loanPayments = signal<Payment[]>([]);

  pendingApplications = signal<LoanApplication[]>([]);
  applicationsLoading = signal<boolean>(false);
  decisionInProgress = signal<number | null>(null);

  scheduleLoading = signal<boolean>(false);
  paymentSubmitting = signal<boolean>(false);
  paymentMessage = signal<string>('');
  paymentError = signal<string>('');

  themeClass = "ag-theme-alpine";

  quauntity = signal(1);

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private DataService: CommonService,
    private datePipe: DatePipe
  ) {
    this.currentDateTime = this.datePipe.transform(new Date(), 'fullDate') + ' ' + this.datePipe.transform(new Date(), 'shortTime');
    this.staffForm = this.formBuilder.group({
      loanId: ['', Validators.required],
    });

    this.paymentForm = this.formBuilder.group({
      amountPaid: [null, [Validators.required, Validators.min(0.01)]],
      method: ['cash', Validators.required],
      scheduleId: [null],
    });
  }

  loanFiles: LoanFile[] = [
    { fileName: 'loan-agreement.pdf', fileType: 'PDF', uploadDate: new Date('2024-01-01') },
    { fileName: 'credit-report.docx', fileType: 'DOCX', uploadDate: new Date('2024-02-01') },
    { fileName: 'collateral.png', fileType: 'Image', uploadDate: new Date('2024-03-01') },
    { fileName: 'loan-repayment-schedule.xlsx', fileType: 'Excel', uploadDate: new Date('2024-04-01') }
  ];

  comments: Comment[] = [
    { userName: 'John Doe', text: 'Initial review completed.', timestamp: new Date('2024-01-15T10:30:00') },
    { userName: 'Jane Smith', text: 'Loan approved.', timestamp: new Date('2024-02-01T14:45:00') },
    { userName: 'Patricia Akiding', text: 'Everything checks out', timestamp: new Date('2024-01-15T10:30:00') },
    { userName: 'Erotu Felix-Manager', text: 'Loan disbursed.', timestamp: new Date('2024-02-01T14:45:00') },
  ];
  newComment: Comment = { userName: 'Current User', text: '', timestamp: new Date() };

  ngOnInit(): void {
    this.fetchLoans();
    this.fetchPendingApplications();
  }

  fetchLoans(): void {
    this.DataService.getLoans().subscribe({
      next: (res) => this.loans.set(res),
      error: (error) => console.error('Error fetching loans', error)
    });
  }

  fetchPendingApplications(): void {
    this.applicationsLoading.set(true);
    this.DataService.getLoanApplications().subscribe({
      next: (res) => {
        this.pendingApplications.set(res.filter(app => app.status === 'pending'));
        this.applicationsLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching loan applications', error);
        this.applicationsLoading.set(false);
      }
    });
  }

  onLoanSelected(): void {
    const loanId = Number(this.staffForm.value.loanId);
    const loan = this.loans().find(l => l.id === loanId) || null;
    this.selectedLoan.set(loan);
    this.paymentForm.reset({ amountPaid: null, method: 'cash', scheduleId: null });
    this.paymentMessage.set('');
    this.paymentError.set('');

    if (!loan) {
      this.loanSchedule.set([]);
      this.loanPayments.set([]);
      return;
    }

    this.scheduleLoading.set(true);
    this.DataService.getLoanSchedule(loan.id).subscribe({
      next: (res) => {
        this.loanSchedule.set(res);
        this.scheduleLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching loan schedule', error);
        this.scheduleLoading.set(false);
      }
    });

    this.DataService.getPayments().subscribe({
      next: (res) => {
        this.loanPayments.set(res.filter(p => p.loanId === loan.id));
      },
      error: (error) => console.error('Error fetching payments', error)
    });
  }

  decide(application: LoanApplication, status: 'approved' | 'rejected'): void {
    const comment = window.prompt(`Optional comment for this ${status} decision:`) || undefined;
    this.decisionInProgress.set(application.id);
    this.DataService.decideLoanApplication(application.id, { status, comment }).subscribe({
      next: () => {
        this.decisionInProgress.set(null);
        this.fetchPendingApplications();
        this.fetchLoans();
      },
      error: (error) => {
        console.error('Error deciding application', error);
        this.decisionInProgress.set(null);
      }
    });
  }

  submitPayment(): void {
    this.paymentMessage.set('');
    this.paymentError.set('');

    const loan = this.selectedLoan();
    if (!loan) {
      this.paymentError.set('Select a loan first.');
      return;
    }

    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const v = this.paymentForm.value;
    this.paymentSubmitting.set(true);
    this.DataService.makePayment({
      loanId: loan.id,
      scheduleId: v.scheduleId ? Number(v.scheduleId) : undefined,
      amountPaid: Number(v.amountPaid),
      method: v.method,
    }).subscribe({
      next: () => {
        this.paymentSubmitting.set(false);
        this.paymentMessage.set('Payment recorded successfully.');
        this.paymentForm.reset({ amountPaid: null, method: 'cash', scheduleId: null });
        // Refresh schedule, payments, and loan balance
        this.DataService.getLoanSchedule(loan.id).subscribe(res => this.loanSchedule.set(res));
        this.DataService.getPayments().subscribe(res => this.loanPayments.set(res.filter(p => p.loanId === loan.id)));
        this.DataService.getLoan(loan.id).subscribe(res => this.selectedLoan.set(res));
      },
      error: (error) => {
        console.error('Error recording payment', error);
        this.paymentError.set(error?.error?.message || 'Failed to record payment.');
        this.paymentSubmitting.set(false);
      }
    });
  }

  downloadFile(file: LoanFile): void {
    // Logic to download the file
    console.log('Downloading file:', file);
  }

  deleteFile(file: LoanFile): void {
    // Logic to delete the file
    console.log('Deleting file:', file);
  }

  editFile(file: LoanFile): void {
    // Logic to edit the file
    console.log('Editing file:', file);
  }

  addComment() {
    if (this.newComment.text.trim()) {
      this.newComment.timestamp = new Date();
      this.comments.push({ ...this.newComment });
      this.newComment.text = '';
    }
  }

  goToChildRoute(route: string) {
    this.router.navigate([route]);
  }
}
