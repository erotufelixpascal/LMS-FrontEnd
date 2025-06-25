import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../Services/common.service';
import { GridSizeChangedEvent } from 'ag-grid-community';
import { LoanCategoryComponent } from '../loan-category/loan-category.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';

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
    selector: 'app-employee-payroll',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatTabsModule,
        AgGridModule,
        MatTooltipModule
    ],
    templateUrl: './employee-payroll.component.html',
    styleUrl: './employee-payroll.component.scss'
})
export class EmployeePayrollComponent implements OnInit{
  currentDateTime: string;

  constructor(
    private router: Router,
    private DataService:CommonService,
    private modalService:NgbModal,
    private datePipe: DatePipe 
  ){
    this.currentDateTime = this.datePipe.transform(new Date(), 'fullDate') + ' ' + this.datePipe.transform(new Date(), 'shortTime');
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
    console.log('Downloading file:');
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
  showModal(){
    //const modalRef = this.modalService.open(LoanCategoryComponent);
    const modalRef = this.modalService.open(LoanCategoryComponent);
    modalRef.closed.subscribe((data) => {
      console.log("onclosed", data);
      if (data == 1) {
        //this.ClassList(this.courseIDInt);

      }
    });
  }
  onGridSizeChange(params: GridSizeChangedEvent) {
    const gridApi = params.api;
    gridApi.sizeColumnsToFit();
  }

  goToChildRoute(route :string ){
      this.router.navigate([route]);
    }

}
