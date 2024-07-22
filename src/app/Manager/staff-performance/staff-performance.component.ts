import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';

@Component({
  selector: 'app-staff-performance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule
  ],
  providers: [DatePipe],
  templateUrl: './staff-performance.component.html',
  styleUrl: './staff-performance.component.scss'
})
export class StaffPerformanceComponent implements OnInit {

  staffForm: FormGroup
  currentDateTime:string=""
  staffList: any[]=[];

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
  }

  onSubmit(){}

  goToChildRoute(route :string ){
    this.router.navigate([route]);
  }

}
