import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridSizeChangedEvent } from 'ag-grid-community';
import { forkJoin } from 'rxjs';

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

@Component({
    selector: 'app-staff-performance',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatTooltipModule,
        AgGridModule
    ],
    providers: [DatePipe],
    templateUrl: './staff-performance.component.html',
    styleUrl: './staff-performance.component.scss'
})
export class StaffPerformanceComponent implements OnInit {

  staffForm: FormGroup
  currentDateTime:string=""
  // no-dd-sa:typescript-best-practices/no-explicit-any
  staffList: any[]=[];
  // no-dd-sa:typescript-best-practices/no-explicit-any
  staffPerformanceList : any[]=[];
  themeClass = "ag-theme-alpine";
  mergedData: IRow[] = [];
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  staffCol: ColDef[] = [
    // { field: "StaffID", headerName: "Staff ID", width:150 },
    { field: "lastName", headerName: "Last Name" },
    { field: "firstName", headerName: "First Name" },
    { field: "loans_applied", headerName: "Applied", width:140 },
    { field: "loans_pending", headerName: "Pending", width:140 },
    { field: "loans_disbursed", headerName: "Disbursed", width:150 },
    { field: "loans_recovered", headerName: "Recovered", width:150 },
    { field: "effectiveness", headerName: "Effectiveness(%)", width:180 }
  ];

  constructor(
    private fb:FormBuilder,
    private dataService:CommonService,
    private router: Router,
    private datePipe: DatePipe){

    this.currentDateTime = this.datePipe.transform(new Date(), 'fullDate') + ' ' + this.datePipe.transform(new Date(), 'shortTime');
    this.staffForm = this.fb.group({
      staffID :["", Validators.required],

    })

  }
  // ngOnInit(): void {
  //   forkJoin({
  //     // staffList: this.dataService.getStaffList(),
  //     staffPerformanceList: this.dataService.getStatistics()
  //     // staffPerformanceList: this.dataService.getLoanCategories()
  //   }).subscribe((result) => {
             
  //       // since staffList and staffPerformanceList are both arrays
  //       // this.mergedData = [...result.staffList, ...result.staffPerformanceList]  
  //       this.mergedData = [ result.staffPerformanceList]
  //       console.log(this.mergedData)    
  //     // If you want to use them separately, you can still do that
  //     // this.staffList = result.staffList;
  //     //this.staffPerformanceList = result.staffPerformanceList;
  //   });
  // }
  ngOnInit(): void {
    this.dataService.getStatistics().subscribe((data)=>{
      this.staffPerformanceList= data
    })
    
  }

  goToChildRoute(route :string ){
    this.router.navigate([route]);
  }
  onGridSizeChange(params: GridSizeChangedEvent) {
    const gridApi = params.api;
    gridApi.sizeColumnsToFit();
  }

}
