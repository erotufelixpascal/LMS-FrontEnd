
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CommonService } from "../../Services/common.service";
import { CommonModule } from "@angular/common";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    // BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  roles: number = 0;
  customerID : string =''
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private DataService: CommonService
  ) {
    this.loginForm = this.fb.group({
        username: ["", Validators.required],
        password: ["", Validators.required],
      });
  }

  ngOnInit() { }

  login() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      //localStorage.setItem("PID","23456")
      //this.router.navigate(["/loan-application"]);
      this.DataService.getUsers().subscribe((res) =>{
        // localStorage.setItem("userPID", "res.customerID");
        this.customerID = res.customerID;
      })

      this.DataService.getUserRole(this.customerID).subscribe((data) => {
        this.roles = data[0].userRole;
        if (this.roles) {
            // "id": 1,"userType": "Manager",
            // if (data[0].userRole = 1) {
            if (this.roles = 1) {
                this.router.navigate(["/adminpage"]);
              }
            // "id": 2,"userType": "Loans Officer",
            if (this.roles = 2) {
                this.router.navigate(["/siteadminpage"]);
              }
            // "id": 3,"userType": "Individual Client",
            if (this.roles = 3) {
                this.router.navigate(["/loan-application"]);
              }
            // "id": 4,"userType": "Business Client",
            if (this.roles = 4) {
                this.router.navigate(["/loan-application"]);
              }
        }else if (this.roles = 0) {
            //add code for unregistered PID
        }});
      };
    }

  onSubmit(event: Event) {
    if (this.loginForm.valid) {
      event.preventDefault();
      this.router.navigate(["/signIn"]);
    }
  }
}


