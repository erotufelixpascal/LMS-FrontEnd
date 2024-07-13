import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';
import {MatTabsModule} from '@angular/material/tabs';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridReadyEvent,  GridSizeChangedEvent, createGrid } from "ag-grid-community";

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
  selector: 'app-client-home',
  standalone: true,
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
  clientForm: FormGroup;
  themeClass = "ag-theme-alpine";
  repaymentList: IRow[] = [];
  scheduleList: IRow[] = [];
  gridApi: any;
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  colDefs: ColDef[] = [
    { field: "ParticipantFirstName", headerName: "Loan Number" },
    { field: "ParticipantLastName", headerName: "Client ID" },
    { field: "ParticipantNamesLike", headerName: "Loan Amount" },
    { field: "course_partner_PID", headerName: "Loan Amount Paid" },
    { field: "CoursePartnerFirstName", headerName: "Date Paid" },
    { field: "CoursePartnerLastName", headerName: "Mode of Payment" },
    { field: "CoursePartnerNamesLike", headerName: "Balance Remaining" },
  ];


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private DataService: CommonService
   ){
    this.clientForm = this.fb.group({
      Name: ["", Validators.required],
      RelationshipFor: ["", Validators.required],
      Active: [false],
      Order: [
        null,
        [Validators.required, Validators.min(1), Validators.max(7)],
      ],
      Archive: [false],
    });
   }

  ngOnInit(): void {}

  goToChildRoute(route :string ){
    this.router.navigate([route]);
  }

  onGridSizeChange(params: GridSizeChangedEvent) {
    const gridApi = params.api;
    gridApi.sizeColumnsToFit();
  }

  



}
