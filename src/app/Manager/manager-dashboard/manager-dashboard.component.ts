import { Component, inject, effect, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { CommonService } from '../../Services/common.service';
import { MatTabsModule } from '@angular/material/tabs';
import { LoanCategoryComponent } from '../loan-category/loan-category.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkTableModule } from '@angular/cdk/table';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ViewChild, AfterViewInit } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  Collateral,
  Loan,
  LoanApplication,
  LoanCategory,
  Statistics,
} from '../../Services/models/api.models';



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
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatTabsModule,
        MatTooltipModule,
        CdkTableModule,
        MatCardModule,
        MatTableModule,
        // MatSortModule,
        // MatFormFieldModule,
        // MatInputModule
    ],
    providers: [DatePipe],
    templateUrl: './manager-dashboard.component.html',
    styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements AfterViewInit {

  router = inject(Router);
  DataService = inject(CommonService);

  datePipe = inject(DatePipe);
  currentDateTime :string='';
  dashboardData = signal<Statistics | null>(null);
  isOpen = signal<boolean>(false);
  registeredParticipantsList = signal<any[]>([]);
  // currentDateTime = signal('');
  loanCategories = signal<LoanCategory[]>([]);
  loanName = signal('');
  themeClass = 'ag-theme-alpine';
  loanApprovalList = signal<LoanApplication[]>([]);
  loanDisbursementList = signal<Loan[]>([]);
  loanClosedList = signal<Loan[]>([]);
  loanCollateralList = signal<Collateral[]>([]);
  displayedColumns: string[] = ['description', 'estimatedValue', 'applicationId', 'documentUrl'];
  dataSource = new MatTableDataSource(this.loanCollateralList());

  // Loading / error state (per section)
  loadingStats = signal<boolean>(true);
  loadingApprovals = signal<boolean>(true);
  loadingDisbursed = signal<boolean>(true);
  loadingClosed = signal<boolean>(true);
  loadingCollateral = signal<boolean>(true);
  loadingCategories = signal<boolean>(true);

  statsError = signal<string | null>(null);
  approvalsError = signal<string | null>(null);
  disbursedError = signal<string | null>(null);
  closedError = signal<string | null>(null);
  collateralError = signal<string | null>(null);
  categoriesError = signal<string | null>(null);

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loanFiles: LoanFile[] = [
    { fileName: 'loan-agreement.docx', fileType: 'DOCX', uploadDate: new Date('2024-01-01') },
    { fileName: 'credit-report.docx', fileType: 'DOCX', uploadDate: new Date('2024-02-01') },
    { fileName: 'collateral.docx', fileType: 'DOCX', uploadDate: new Date('2024-03-01') },
    // { fileName: 'loan-repayment-schedule.xlsx', fileType: 'Excel', uploadDate: new Date('2024-04-01') }
  ];

  comments: Comment[] = [
    { userName: 'John Doe', text: 'Initial review completed.', timestamp: new Date('2024-01-15T10:30:00') },
    { userName: 'Jane Smith', text: 'Loan approved.', timestamp: new Date('2024-02-01T14:45:00') },
    { userName: 'Patricia Akiding', text: 'Everything checks out', timestamp: new Date('2024-01-15T10:30:00') },
    { userName: 'Erotu Felix-Manager', text: 'Loan disbursed.', timestamp: new Date('2024-02-01T14:45:00') }
  ];
  newComment: Comment = { userName: 'Current User', text: '', timestamp: new Date() };

  constructor(
    // private datePipe: DatePipe
  ) {
    this.currentDateTime =(this.datePipe.transform(new Date(), 'fullDate') + ' ' + this.datePipe.transform(new Date(), 'shortTime'));
    this.loadLoanData();
    this.loanApprovalListData();
    this.loanClosedListData();
    this.loanDisbursementListData();
    this.getCollateralList();
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loadingStats.set(true);
    this.statsError.set(null);
    this.DataService.getStatistics().subscribe({
      next: (res) => {
        this.dashboardData.set(res);
      },
      error: (error) => {
        console.error('Error fetching dashboard statistics:', error);
        this.statsError.set('Unable to load portfolio statistics.');
      },
      complete: () => {
        this.loadingStats.set(false);
      }
    });
  }

  loanApprovalListData(){
    this.loadingApprovals.set(true);
    this.approvalsError.set(null);
    this.DataService.getLoanApplications().subscribe({
      next:(res)=>{
        this.loanApprovalList.set((res || []).filter(app => app.status === 'pending'));
      },
      error: (error) =>{
        console.error('Error fetching dashboard data:', error);
        this.approvalsError.set('Unable to load pending loan applications.');
      },
      complete: () => {
        this.loadingApprovals.set(false);
      }
  });
}
  loanDisbursementListData(){
    this.loadingDisbursed.set(true);
    this.disbursedError.set(null);
    this.DataService.getLoans().subscribe({
      next:(res)=>{
        this.loanDisbursementList.set(res || []);
      },
      error: (error) =>{
        console.error('Error fetching loan disbursed data:', error);
        this.disbursedError.set('Unable to load disbursed loans.');
      },
      complete: () => {
        this.loadingDisbursed.set(false);
      }
  });
}
  loanClosedListData(){
    this.loadingClosed.set(true);
    this.closedError.set(null);
    this.DataService.getLoans('closed').subscribe({
      next:(res)=>{
        this.loanClosedList.set(res || []);
      },
      error: (error) =>{
        console.error('Error fetching loans closed data:', error);
        this.closedError.set('Unable to load closed loans.');
      },
      complete: () => {
        this.loadingClosed.set(false);
      }
  });
  }
  loadLoanData() {
      this.loadingCategories.set(true);
      this.categoriesError.set(null);
      this.DataService.getLoanCategories().subscribe({
      next: (res) => {
        this.loanCategories.set(res || []);
      },
      error: (error) => {
        console.error('Error fetching loan data data:', error);
        this.categoriesError.set('Unable to load loan categories.');
      },
      complete: () => {
        this.loadingCategories.set(false);
      }
    });
  }

  getCollateralList(){
    this.loadingCollateral.set(true);
    this.collateralError.set(null);
    this.DataService.getCollateral().subscribe({
      next: (res) => {
        this.loanCollateralList.set(res || []);
        this.dataSource.data = this.loanCollateralList();
      },
      error: (error) => {
        console.error('Error fetching collateral data:', error);
        this.collateralError.set('Unable to load collateral records.');
      },
      complete: () => {
        this.loadingCollateral.set(false);
      }
    })
  }

  downloadFile(file: LoanFile): void {
    console.log('Downloading file:', file);
  }

  deleteFile(file: LoanFile): void {
    console.log('Deleting file:', file);
  }

  editFile(file: LoanFile): void {
    console.log('Editing file:', file);
  }

  addComment() {
    if (this.newComment.text.trim()) {
      this.newComment.timestamp = new Date();
      this.comments.push({ ...this.newComment });
      this.newComment.text = '';
    }
  }

  openAddCollateralDialog(){
    console.log('Add Collateral:');
  }

  ef = effect(() => {
    console.log('Dashboard data updated', this.dashboardData());
  });

  visibleColumns: { [key: string]: boolean } = {
    description: true,
    estimatedValue: true,
    applicationId: true,
    documentUrl: true
  };

  toggleColumnVisibility(column: string): void {
    this.visibleColumns[column] = !this.visibleColumns[column];
    this.displayedColumns = Object.keys(this.visibleColumns).filter(key => this.visibleColumns[key]);
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return '';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approved') || statusLower.includes('disbursed') || statusLower.includes('active') || statusLower === 'released') {
      return 'status-approved';
    }
    if (statusLower.includes('pending')) {
      return 'status-pending';
    }
    if (statusLower.includes('rejected') || statusLower.includes('closed') || statusLower.includes('defaulted')) {
      return 'status-rejected';
    }
    return '';
  }

  goToChildRoute(route :string ){
    this.router.navigate([route]);

  }
}
