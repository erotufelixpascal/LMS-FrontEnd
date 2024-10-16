import { Component, Inject, effect, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { CommonService } from '../../Services/common.service';
import { MatTabsModule } from '@angular/material/tabs';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridSizeChangedEvent } from 'ag-grid-community';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanCategoryComponent } from '../loan-category/loan-category.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, forkJoin } from 'rxjs';

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
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    AgGridModule,
    MatTooltipModule
  ],
  providers: [DatePipe],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent {

  router = Inject(Router);
  DataService = Inject(CommonService);
  modalService = Inject(NgbModal);
  // datePipe = Inject(DatePipe);

  currentDateTime :string='';
  dashboardData = signal(null);
  isOpen = signal<boolean>(false);
  registeredParticipantsList = signal<any[]>([]);
  // currentDateTime = signal('');
  loanCategories = signal<any[]>([]);
  loanName = signal('');
  themeClass = 'ag-theme-alpine';
  loanApprovalList = signal<any[]>([]);
  loanDisbursementList = signal<any[]>([]);
  loanClosedList = signal<any[]>([]);

  gridApi: any;
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  loanApproval: ColDef[] = [
    { field: 'loanNumber', headerName: 'Loan Number' },
    { field: 'principleAmount', headerName: 'Principal Amount' },
    { field: 'interestAmount', headerName: 'Interest Amount' },
    { field: 'totalAmount', headerName: 'Loan Amount' },
    { field: 'status', headerName: 'Change Loan Status' }
  ];

  loanDisbursement: ColDef[] = [
    { field: 'loanNumber', headerName: 'Loan Number' },
    { field: 'principleAmount', headerName: 'Principal Amount' },
    { field: 'interestAmount', headerName: 'Interest Amount' },
    { field: 'totalAmount', headerName: 'Loan Amount' },
    { field: 'status', headerName: 'Loan Status' }
  ];

  loanClosed: ColDef[] = [
    { field: 'loanNumber', headerName: 'Loan Number' },
    { field: 'principleAmount', headerName: 'Principal Amount' },
    { field: 'interestAmount', headerName: 'Interest Amount' },
    { field: 'totalAmount', headerName: 'Loan Amount' },
    { field: 'status', headerName: 'Loan Status' }
  ];

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
    { userName: 'Erotu Felix-Manager', text: 'Loan disbursed.', timestamp: new Date('2024-02-01T14:45:00') }
  ];
  newComment: Comment = { userName: 'Current User', text: '', timestamp: new Date() };

  constructor(
    private datePipe: DatePipe
  ) {
    this.currentDateTime =(this.datePipe.transform(new Date(), 'fullDate') + ' ' + this.datePipe.transform(new Date(), 'shortTime'));
    this.loadLoanData();
  }

  loadLoanData() {
    forkJoin({
      loanCategories: this.DataService.getLoanCategories() as Observable<any[]>,
      // loans : this.DataService.
      // loanDisbursementList: this.DataService.getDisbusredLoan() as Observable<any[]>,
      // loanApprovalList: this.DataService.getPendingLoan() as Observable<any[]>,
      // loanClosedList: this.DataService.getClosedLoan() as Observable<any[]>
    }).subscribe({
      next: (res) => {
        this.loanCategories.set(res.loanCategories) ;
        // this.loanDisbursementList.set(res.loanDisbursementList);
        // this.loanApprovalList.set(res.loanApprovalList);
        // this.loanClosedList.set(res.loanClosedList);
      },
      error: (error) => {
        console.error('Error fetching dashboard data:', error);
      },
      complete: () => {
        console.log('All subscriptions complete');
      }
    });
  }

  downloadFile(file: LoanFile): void {
    console.log('Downloading file:', file);
  }

  deleteFile(file: LoanFile): void {
    console.log('Deleting file:', file);
  }

  addComment() {
    if (this.newComment.text.trim()) {
      this.newComment.timestamp = new Date();
      this.comments.push({ ...this.newComment });
      this.newComment.text = '';
    }
  }

  showModal() {
    const modalRef = this.modalService.open(LoanCategoryComponent);
    modalRef.closed.subscribe((data: any) => {
      console.log('onclosed', data);
      if (data === 1) {
        // Logic to refresh or update upon modal close
      }
    });
  }

  onGridSizeChange(params: GridSizeChangedEvent) {
    const gridApi = params.api;
    gridApi.sizeColumnsToFit();
  }

  goToChildRoute(route: string) {
    this.router.navigate([route]);
  }

  ef = effect(() => {
    console.log('Dashboard data updated', this.dashboardData());
  });
}
