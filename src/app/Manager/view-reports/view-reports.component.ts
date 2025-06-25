import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-view-reports',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatTooltipModule
    ],
    providers: [DatePipe],
    templateUrl: './view-reports.component.html',
    styleUrl: './view-reports.component.scss'
})
export class ViewReportsComponent implements OnInit{

  reportForm: FormGroup
  currentDateTime:string=""

  constructor(
    private fb:FormBuilder,
    private DataService:CommonService,
    private router: Router,
    private datePipe: DatePipe){

    this.currentDateTime = this.datePipe.transform(new Date(), 'fullDate') + ' ' + this.datePipe.transform(new Date(), 'shortTime');
    this.reportForm = this.fb.group({

    })

  }
  ngOnInit(): void {}

  onSubmit(){}

  goToChildRoute(route :string ){
    this.router.navigate([route]);
  }

}
