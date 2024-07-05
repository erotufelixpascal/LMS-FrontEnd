
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CommonService } from "../../Services/common.service";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "../../app-routing.module";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  roles!: string[];
  
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

      this.DataService.getUserRole().subscribe((data) => {
        this.roles = data;
        if (this.roles) {
            // "id": 1,"userType": "Manager",
            // if (data[0].userRole = 1) {
            if (data[0].userRole = 1) {
                this.router.navigate(["/adminpage"]);
              }
            // "id": 2,"userType": "Loans Officer",
            if (data[0].userRole = 2) {
                this.router.navigate(["/siteadminpage"]);
              }
            // "id": 3,"userType": "Individual Client",
            if (data[0].userRole = 3) {
                this.router.navigate(["/loan-application"]);
              }
            // "id": 4,"userType": "Business Client",
            if (data[0].userRole = 4) {
                this.router.navigate(["/loan-application"]);
              }
        }else if (data[0].userRole = " ") {
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


