import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridSizeChangedEvent } from 'ag-grid-community';

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
  standalone: true,
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
  staffList: any[]=[];
  themeClass = "ag-theme-alpine";
  staffPerformanceList: IRow[] = [];
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  staffCol: ColDef[] = [
    { field: "StaffID", headerName: "Staff ID" },
    { field: "lastName", headerName: "Last Name" },
    { field: "firstName", headerName: "First Name" },
    { field: "loans_applied", headerName: "Applied" },
    { field: "loans_pending", headerName: "Pending" },
    { field: "loans_disbursed", headerName: "Disbursed" },
    { field: "loans_recovered", headerName: "Recovered" },
    { field: "totalAmount", headerName: "Effectiveness" },
    //{ field: "status", headerName: "Loans Disbursed" }
  ];

  constructor(
    private fb:FormBuilder,
    private DataService:CommonService,
    private router: Router,
    private datePipe: DatePipe){

    this.currentDateTime = this.datePipe.transform(new Date(), 'fullDate') + ' ' + this.datePipe.transform(new Date(), 'shortTime');
    this.staffForm = this.fb.group({
      staffID :["", Validators.required],

    })

  }
  ngOnInit(): void {
    this.DataService.getStaffList().subscribe((res)=>{
      this.staffList = res
    })
    this.DataService.getStatistics().subscribe((data) =>{
      this.staffPerformanceList = data
      console.log(this.staffPerformanceList)
    })
  }

  onSubmit(){}

  goToChildRoute(route :string ){
    this.router.navigate([route]);
  }
  onGridSizeChange(params: GridSizeChangedEvent) {
    const gridApi = params.api;
    gridApi.sizeColumnsToFit();
  }

}
