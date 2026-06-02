
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CommonService } from "../../Services/common.service";
import { CommonModule } from "@angular/common";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;          // "manager", "staff", "client"
  branch: string | null;
  status: string;
  createdAt: string;
  lastLogin: string;
}

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        RouterLink
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  // roles: number = 0;
  // email: string='';
  // password: string=''
  // customerID : string =''
  // users : any[] = [];
  userLogin :any[]=[]

  private systemUsers: User[] = [
    {
      "id": 1,
      "firstName": "Nakato",
      "lastName": "Aisha",
      "email": "aisha.nakato@company.co.ug",
      "phone": "+256771234567",
      "role": "manager",
      "branch": "Kampala Central",
      "status": "active",
      "createdAt": "2025-06-15T09:30:00Z",
      "lastLogin": "2026-01-20T14:45:00Z"
    },
    {
      "id": 2,
      "firstName": "Okello",
      "lastName": "James",
      "email": "james.okello@company.co.ug",
      "phone": "+256772345678",
      "role": "staff",
      "branch": "Kampala Central",
      "status": "active",
      "createdAt": "2025-08-02T11:15:00Z",
      "lastLogin": "2026-01-19T09:12:00Z"
    },
    {
      "id": 3,
      "firstName": "Nalwanga",
      "lastName": "Fatuma",
      "email": "fatuma.nalwanga@gmail.com",
      "phone": "+256753456789",
      "role": "client",
      "branch": null,
      "status": "active",
      "createdAt": "2025-11-10T16:20:00Z",
      "lastLogin": "2026-01-18T18:30:00Z"
    },
    {
      "id": 4,
      "firstName": "Mugisha",
      "lastName": "Ronald",
      "email": "ronald.mugisha@company.co.ug",
      "phone": "+256704567890",
      "role": "manager",
      "branch": "Entebbe",
      "status": "active",
      "createdAt": "2025-07-20T10:00:00Z",
      "lastLogin": "2026-01-21T08:55:00Z"
    },
    {
      "id": 5,
      "firstName": "Kizza",
      "lastName": "Sarah",
      "email": "sarah.kizza@yahoo.com",
      "phone": "+256701234567",
      "role": "client",
      "branch": null,
      "status": "active",
      "createdAt": "2025-12-05T13:40:00Z",
      "lastLogin": "2026-01-20T22:10:00Z"
    }
  ];
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private DataService: CommonService
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  ngOnInit() {}

  // login(email: string, password: string) {
  //   if (this.loginForm.valid) {
  //     console.log(this.loginForm.value);
      
  //     this.DataService.loginUser(this.loginForm.value.email).subscribe((data)=>{
  //       this.userLogin = data
  //       console.log(this.userLogin)

  //       localStorage.setItem('currentUser', JSON.stringify(this.userLogin));
  //       this.redirectUser(data.userRole);
  //     })
  //     }
  //    };

  login(){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
    }
  
  const email = this.loginForm.value.email.trim().toLowerCase();
  const password = this.loginForm.value.password;

  // Find user by email (case-insensitive)
  const foundUser = this.systemUsers.find(
    u => u.email.toLowerCase() === email
  );

  if(foundUser) {
    localStorage.setItem('currentUser', JSON.stringify(foundUser));

    this.redirectUser(foundUser.role);
  }else {
    alert('User not found: Contact Support')
  }
  }

  redirectUser(role: string) {
    if (!this.userLogin) {
      this.router.navigate(['/login']);
      alert('Please log in first');
      return;
    }
  
    if (role === 'client') {
      this.router.navigate(['/client']);
    } 
    else if (role === 'manager') {
      this.router.navigate(['/manager']);
    } 
    else if (role === 'staff') {
      this.router.navigate(['/staff']);
    } 
    else {
      this.router.navigate(['/login']);
      alert('Unknown role: ' + role);
    }
  }
  
  onSubmit(event: Event) {
    if (this.loginForm.valid) {
      event.preventDefault();
      this.router.navigate(["/signIn"]);
    }
  }
}

