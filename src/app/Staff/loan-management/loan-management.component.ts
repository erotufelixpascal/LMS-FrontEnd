import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridSizeChangedEvent } from 'ag-grid-community';
import { CommonService } from '../../Services/common.service';

interface IRow {
  loanNumber : string;
  principal : string;
  interest : string;
  totalAmount : string;
  balance : string;
  payment_date : string;
  next_payment_date : string;
  Month: string;

}
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
  templateUrl: './loan-management.component.html',
  styleUrl: './loan-management.component.scss'
})
export class LoanManagementComponent implements OnInit {
  staffForm: FormGroup
  currentDateTime: string;
  gridApi: any;
  loanNumbers :any[] =[];
  loanSchedule: IRow[] = [];
  loanPayment : IRow[] = [];
  loanNumber: string=''
  themeClass = "ag-theme-alpine";
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };
  quauntity = signal(1)

  constructor (
    private router: Router,
    private formBuilder: FormBuilder,
    private DataService:CommonService,
    private modalService:NgbModal,
    private datePipe: DatePipe
){ 
  this.currentDateTime = this.datePipe.transform(new Date(), 'fullDate') + ' ' + this.datePipe.transform(new Date(), 'shortTime');
  this.staffForm = this.formBuilder.group({
    loanNumber: ['', Validators.required],
  })

}

schedule: ColDef[] = [
  { field: "loanNumber", headerName: "Loan Number" },
  { field: "principal", headerName: "Principal Amount" },
  { field: "interest", headerName: "Interest Amount" },
  { field: "totalAmount", headerName: "Total Amount" },
  { field: "balance", headerName: "Balance" },
  { field: "payment_date", headerName: "Due Date" },
  { field: "next_payment_date", headerName: "Next Payment Date" },
  { field: "Month", headerName: "Month" }
  
];
payment: ColDef[] = [
  { field: "loanNumber", headerName: "Loan Number" },
  { field: "principal", headerName: "Principal Amount" },
  { field: "interest", headerName: "Interest Amount" },
  { field: "totalAmount", headerName: "Total Amount" },
  { field: "balance", headerName: "Balance" },
  { field: "payment_date", headerName: "Due Date" },
  { field: "next_payment_date", headerName: "Next Payment Date" },
  { field: "Month", headerName: "Month" }
  
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
    { userName: 'Erotu Felix-Manager', text: 'Loan disbursed.', timestamp: new Date('2024-02-01T14:45:00') },
  ];
  newComment: Comment = { userName: 'Current User', text: '', timestamp: new Date() };
  
  ngOnInit(): void {
    this.loans(); 
   }
   loans(){
    this.DataService.getLoans().subscribe((res) =>{
      this.loanNumbers = res
  })
}
   schedules(loanNumber : string){
    const formData = this.staffForm.value;
  console.log('Loan Number:', formData.loanNumber); 
  this.loanNumber = formData.loanNumber
    this.DataService.getSchedule(this.loanNumber).subscribe((res) =>{
      this.loanSchedule = res
      // console.log(this.loanSchedule)
    })

    this.DataService.getPayments().subscribe((res)=>{
      this.loanPayment = res
      // console.log(this.loanPayment)
    })
  }
  
  showModal(){
    //const modalRef = this.modalService.open(LoanCategoryComponent);
    const modalRef = this.modalService.open(LoanManagementComponent);
    modalRef.closed.subscribe((data) => {
      console.log("onclosed", data);
      if (data == 1) {
        //this.ClassList(this.courseIDInt);
  
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
  
  addComment() {
    if (this.newComment.text.trim()) {
      this.newComment.timestamp = new Date();
      this.comments.push({ ...this.newComment });
      this.newComment.text = '';
    }
  }
  
  onGridSizeChange(params: GridSizeChangedEvent) {
    const gridApi = params.api;
    gridApi.sizeColumnsToFit();
  }
  
  goToChildRoute(route :string ){
      this.router.navigate([route]);
    }




}
