import { Component, inject, effect, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { CommonService } from '../../Services/common.service';
import { MatTabsModule } from '@angular/material/tabs';
import { ColDef, GridSizeChangedEvent } from 'ag-grid-community';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  modalService = inject(NgbModal);
  datePipe = inject(DatePipe);
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
  loanCollateralList = signal<any[]>([]);
  displayedColumns: string[] = ['assetName', 'assetType', 'estimatedValue', 'loanId', 'status'];
  dataSource = new MatTableDataSource(this.loanCollateralList());

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // displayedColumns: string[] = Object.keys(this.visibleColumns).filter(key => this.visibleColumns[key]);

  // gridApi: any;
  // defaultColDef: ColDef = {
  //   sortable: true,
  //   filter: true,
  //   resizable: true,
  // };

  // loanApproval = [
  //   { field: 'loanNumber' },
  //   { field: 'principalAmount' },
  //   { field: 'interestAmount' },
  //   { field: 'totalAmount' },
  //   { field: 'status'}
  // ];

  // loanDisbursement = [
  //   { field: 'loanNumber', headerName: 'Loan Number' },
  //   { field: 'PrincipalAmount', headerName: 'Principal Amount' },
  //   { field: 'InterestAmount' , headerName: 'Interest Amount'},
  //   { field: 'TotalAmount', headerName: 'Total Amount' },
  //   { field: 'email' , headerName: 'email'}
  // ];

  loanClosed: ColDef[] = [
    { field: 'loanNumber', headerName: 'Loan Number' },
    { field: 'principleAmount', headerName: 'Principal Amount' },
    { field: 'interestAmount', headerName: 'Interest Amount' },
    { field: 'totalAmount', headerName: 'Loan Amount' },
    { field: 'status', headerName: 'Loan Status' }
  ];

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
    this.getCollateralList()
  }

  loanApprovalListData(){
    this.DataService.getPendingLoan().subscribe({
      next:(res)=>{
        this.loanApprovalList.set(res);
        console.log(this.loanApprovalList())
      },
      error: (error) =>{
        console.error('Error fetching dashboard data:', error);
      },
      complete: () => {
        console.log('Approved loans complete');
      }
  });
}
  loanDisbursementListData(){
    this.DataService.getDisbusredLoan() .subscribe({
      next:(res)=>{
        this.loanDisbursementList.set(res); 
        console.log(this.loanDisbursementList())       
      },
      error: (error) =>{
        console.error('Error fetching loan disbursed data:', error);
      },
      complete: () => {
        console.log('Disbursed loans complete');
      }
  });
}
  loanClosedListData(){
    this.DataService.getClosedLoan().subscribe({
      next:(res)=>{
        this.loanClosedList.set(res);  
        console.log(this.loanClosedList())       
      },
      error: (error) =>{
        console.error('Error fetching loans closed data:', error);
      },
      complete: () => {
        console.log('Closed loans complete');
      }
  });
  }
  loadLoanData() {
      this.DataService.getLoanCategories().subscribe({
      next: (res) => {
        this.loanCategories.set(res) ;
      },
      error: (error) => {
        console.error('Error fetching loan data data:', error);
      },
      complete: () => {
        console.log('All subscriptions complete');
      }
    });
  }

  getCollateralList(){
    this.DataService.getCollateral().subscribe({
      next: (res) => {
        this.loanCollateralList.set(res) ;
        console.log(this.loanCollateralList()) 
      },
      error: (error) => {
        console.error('Error fetching collateral data:', error);
      },
      complete: () => {
        console.log('Collateral list complete');
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

  ef = effect(() => {
    console.log('Dashboard data updated', this.dashboardData());
  });

  visibleColumns: { [key: string]: boolean } = {
    loanNumber: true, 
    principalAmount : true,
    interestAmount: true,
    totalAmount: true,
    status: true
  };

  // displayedColumns: string[] = Object.keys(this.visibleColumns).filter(key => this.visibleColumns[key]);

  toggleColumnVisibility(column: string): void {
    this.visibleColumns[column] = !this.visibleColumns[column];
    this.displayedColumns = Object.keys(this.visibleColumns).filter(key => this.visibleColumns[key]);
  } 

  

 
  
}
