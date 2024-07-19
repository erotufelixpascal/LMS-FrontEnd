import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../Services/common.service';

@Component({
  selector: 'app-user-roles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './user-roles.component.html',
  styleUrl: './user-roles.component.scss'
})
export class UserRolesComponent implements OnInit {
  assignRoleForm: FormGroup;
  userList: any[]=[];

  constructor(
    private fb:FormBuilder,
    private DataService:CommonService
    ){
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

}
