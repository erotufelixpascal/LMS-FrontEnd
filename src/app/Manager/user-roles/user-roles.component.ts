import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../Services/common.service';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-roles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule
  ],
  providers: [DatePipe],
  templateUrl: './user-roles.component.html',
  styleUrl: './user-roles.component.scss'
})
export class UserRolesComponent implements OnInit {
  assignRoleForm: FormGroup;
  userList: any[]=[];
  currentDateTime: string=""

  constructor(
    private fb:FormBuilder,
    private DataService:CommonService,
    private router: Router,
    private datePipe: DatePipe
    ){
      this.currentDateTime = this.datePipe.transform(new Date(), 'fullDate') + ' ' + this.datePipe.transform(new Date(), 'shortTime');
      this.assignRoleForm = this.fb.group({
        role: ["", Validators.required],
        customerID: ["", Validators.required],
      })
    }

  ngOnInit(): void { 
    this.DataService.getUsers().subscribe((res) =>{
      this.userList = res
    })
  }
  onSubmit(){
    const formValue = this.assignRoleForm.value;
    this.DataService.updateUserRole(formValue.customerID, formValue.role).subscribe(response => {
      console.log('User role updated', response);
    });
    
  }
  goToChildRoute(route :string ){
    this.router.navigate([route]);
  }

}
