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
    { field: "course_partner_PID", headerName: "Processing Fee" },
    { field: "course_partner_PID", headerName: "Principal Amount" },
    { field: "course_partner_PID", headerName: "Interest Amount" },
    { field: "CoursePartnerNamesLike", headerName: "Balance Remaining" },
    { field: "CoursePartnerFirstName", headerName: "Date Paid" },
    { field: "course_partner_PID", headerName: "Penalities" },
    { field: "CoursePartnerLastName", headerName: "Mode of Payment" }

  ];

  colDefs1: ColDef[] = [
    { field: "ParticipantFirstName", headerName: "Loan Number" },
    { field: "ParticipantLastName", headerName: "Client ID" },
    { field: "course_partner_PID", headerName: "Principal Amount Due" },
    { field: "course_partner_PID", headerName: "Interest Amount Due" },
    { field: "CoursePartnerFirstName", headerName: "Due Date" },
    { field: "CoursePartnerNamesLike", headerName: "Balance Remaining" },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private DataService: CommonService,
    private modalService:NgbModal,
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
