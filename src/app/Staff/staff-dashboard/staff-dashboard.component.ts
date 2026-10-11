import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';
import { StaffNavbarComponent } from '../staff-navbar/staff-navbar.component';
import { LoanApplication, Statistics } from '../../Services/models/api.models';

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
    selector: 'app-staff-dashboard',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatTabsModule,
        StaffNavbarComponent,
        MatTooltipModule
    ],
    providers: [DatePipe],
    templateUrl: './staff-dashboard.component.html',
    styleUrl: './staff-dashboard.component.scss'
})
export class StaffDashboardComponent implements OnInit{
  currentDateTime: string;
  gridApi: any;

  statistics = signal<Statistics | null>(null);
  statisticsLoading = signal<boolean>(false);

  recentPendingApplications = signal<LoanApplication[]>([]);
  applicationsLoading = signal<boolean>(false);

  constructor (
    private router: Router,
    private formBuilder: FormBuilder,
    private dataService:CommonService,
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
  this.fetchStatistics();
  this.fetchRecentPendingApplications();
}

fetchStatistics(): void {
  this.statisticsLoading.set(true);
  this.dataService.getStatistics().subscribe({
    next: (res) => {
      this.statistics.set(res);
      this.statisticsLoading.set(false);
    },
    error: (error) => {
      console.error('Error fetching statistics', error);
      this.statisticsLoading.set(false);
    }
  });
}

fetchRecentPendingApplications(): void {
  this.applicationsLoading.set(true);
  this.dataService.getLoanApplications().subscribe({
    next: (res) => {
      const pending = (res || []).filter(app => app.status === 'pending');
      pending.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
      this.recentPendingApplications.set(pending.slice(0, 5));
      this.applicationsLoading.set(false);
    },
    error: (error) => {
      console.error('Error fetching loan applications', error);
      this.applicationsLoading.set(false);
    }
  });
}

showModal(){
  //const modalRef = this.modalService.open(LoanCategoryComponent);

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
