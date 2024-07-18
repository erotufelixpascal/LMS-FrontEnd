import{ Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../Services/common.service';
import { MatTabsModule } from '@angular/material/tabs';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

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
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    // BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    AgGridModule,

],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss'
})

export class ManagerDashboardComponent implements OnInit{
  loanCategories: any[]=[];
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

    constructor (
        private router: Router,
        private DataService:CommonService,
    ){ }

    ngOnInit(): void {
    this.DataService.getLoanCategories().subscribe((res) =>{
      this.loanCategories = res
      // console.log(this.loanCategories)
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

    goToChildRoute(route :string ){
        this.router.navigate([route]);
      }

}
