import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';
import {MatTabsModule} from '@angular/material/tabs';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridReadyEvent,  GridSizeChangedEvent, createGrid } from "ag-grid-community";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoanRepaymentComponent } from '../loan-repayment/loan-repayment.component';


interface IRow {
  participant_PID: string;
  ParticipantFirstName: string;
  ParticipantLastName: string;
  ParticipantNamesLike: string;
  course_partner_PID: string;
  CoursePartnerFirstName: string;
  CoursePartnerLastName: string;
  CoursePartnerNamesLike: string;
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
    selector: 'app-client-home',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatTabsModule,
        AgGridModule,
    ],
    templateUrl: './client-home.component.html',
    styleUrl: './client-home.component.scss'
})
export class ClientHomeComponent implements OnInit{
  themeClass = "ag-theme-alpine";
  repaymentList: IRow[] = [];
  scheduleList: IRow[] = [];
  loanTerm: IRow[] = [];
  gridApi: any;
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  loanRepayment: ColDef[] = [
    { field: "ParticipantFirstName", headerName: "Loan Number" },
    { field: "ParticipantLastName", headerName: "Client ID" },
    { field: "ParticipantNamesLike", headerName: "Loan Amount" },
    { field: "course_partner_PID", headerName: "Processing Fee" },
    { field: "course_partner_PID", headerName: "Principal Amount" },
    { field: "course_partner_PID", headerName: "Interest Amount" },
    { field: "CoursePartnerNamesLike", headerName: "Balance Remaining" },
    { field: "CoursePartnerFirstName", headerName: "Date Paid" },
    { field: "course_partner_PID", headerName: "Penalities" },
    { field: "CoursePartnerLastName", headerName: "Mode of Payment" }
  ];

  loanRepaymentSchedule: ColDef[] = [
    { field: "ParticipantFirstName", headerName: "Loan Number" },
    { field: "ParticipantLastName", headerName: "Client ID" },
    { field: "course_partner_PID", headerName: "Principal Amount Due" },
    { field: "course_partner_PID", headerName: "Interest Amount Due" },
    { field: "CoursePartnerFirstName", headerName: "Due Date" },
    { field: "CoursePartnerNamesLike", headerName: "Balance Remaining" },
  ];

  loanTerms: ColDef[] = [
    { field: "loanType", headerName: "Loan Type" },
    { field: "typicalPeriod", headerName: "Typical Period" },
    { field: "commonUseCases", headerName: "Common Use Cases" }
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private DataService: CommonService,
    private modalService:NgbModal,
   ){ }

  ngOnInit(): void {
    this.DataService.loanTerms().subscribe((res) =>{
      this.loanTerm = res
      })
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

  // addRepayment(){}

  // showModal(data: any) {
    showModal() {
    const modalRef = this.modalService.open(LoanRepaymentComponent);
    //modalRef.componentInstance.data = data.data;

    modalRef.closed.subscribe((data) => {
      console.log("onclosed", data);
      if (data == 1) {
        //this.ClassList(this.courseIDInt);

      }
    });
  }
  goToChildRoute(route :string ){
      console.log('Navigating to:', route);
      this.router.navigate([route]);
  }

  onGridSizeChange(params: GridSizeChangedEvent) {
    const gridApi = params.api;
    gridApi.sizeColumnsToFit();
  }

  



}
