import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../Services/common.service';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ManagerNavbarComponent } from '../../Navbar/manager-navbar/manager-navbar.component';

@Component({
  selector: 'app-user-roles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule,
    ManagerNavbarComponent
  ],
  providers: [DatePipe],
  templateUrl: './user-roles.component.html',
  styleUrl: './user-roles.component.scss'
})
export class UserRolesComponent implements OnInit {
  assignRoleForm: FormGroup;
  roles: any[]=[];
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
        firstName :["", Validators.required],
        lastName :["", Validators.required],
        email :["", Validators.required],
        address :["", Validators.required],
        designation :["", Validators.required],
        phone :["", Validators.required],
        information :["", Validators.required],
      })
    }

  ngOnInit(): void { 
    this.DataService.getRoles().subscribe((res) =>{
      this.roles = res
    })
    
  }
  onSubmit(){
    const formValue = this.assignRoleForm.value;
    this.DataService.addUser(formValue.role,formValue.firstName,formValue.lastName,formValue.email,formValue.address,formValue.designation,formValue.phone,formValue.information).subscribe(response => {
      console.log('User role updated', response);
    });
    
  }
  goToChildRoute(route :string ){
    this.router.navigate([route]);
  }

}
