
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
  password: string;
  role: string;
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
  errorMessage = '';

  private systemUsers: User[] = [
    {
      id: 1,
      firstName: "Aisha",
      lastName: "Nakato",
      email: "aisha.nakato@company.co.ug",
      phone: "+256771234567",
      password: "Manager@2025",
      role: "manager",
      branch: "Kampala Central",
      status: "active",
      createdAt: "2025-06-15T09:30:00Z",
      lastLogin: "2026-01-20T14:45:00Z"
    },
    {
      id: 2,
      firstName: "James",
      lastName: "Okello",
      email: "james.okello@company.co.ug",
      phone: "+256772345678",
      password: "Staff@2025",
      role: "staff",
      branch: "Kampala Central",
      status: "active",
      createdAt: "2025-08-02T11:15:00Z",
      lastLogin: "2026-01-19T09:12:00Z"
    },
    {
      id: 3,
      firstName: "Fatuma",
      lastName: "Nalwanga",
      email: "fatuma.nalwanga@gmail.com",
      phone: "+256753456789",
      password: "Client@2025",
      role: "client",
      branch: null,
      status: "active",
      createdAt: "2025-11-10T16:20:00Z",
      lastLogin: "2026-01-18T18:30:00Z"
    },
    {
      id: 4,
      firstName: "Ronald",
      lastName: "Mugisha",
      email: "ronald.mugisha@company.co.ug",
      phone: "+256704567890",
      password: "Manager@2025",
      role: "manager",
      branch: "Entebbe",
      status: "active",
      createdAt: "2025-07-20T10:00:00Z",
      lastLogin: "2026-01-21T08:55:00Z"
    },
    {
      id: 5,
      firstName: "Sarah",
      lastName: "Kizza",
      email: "sarah.kizza@yahoo.com",
      phone: "+256701234567",
      password: "Client@2025",
      role: "client",
      branch: null,
      status: "active",
      createdAt: "2025-12-05T13:40:00Z",
      lastLogin: "2026-01-20T22:10:00Z"
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

  login() {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.value.email.trim().toLowerCase();
    const password = this.loginForm.value.password;

    // Check hardcoded system users first
    let foundUser: any = this.systemUsers.find(
      u => u.email.toLowerCase() === email && u.password === password
    );

    // Fall back to localStorage-registered users (self-signup)
    if (!foundUser) {
      const registered: any[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      foundUser = registered.find(
        u => u.email.toLowerCase() === email && u.password === password
      );
    }

    if (foundUser) {
      const { password: _pw, ...safeUser } = foundUser;
      localStorage.setItem('currentUser', JSON.stringify(safeUser));
      this.redirectUser(foundUser.role);
    } else {
      this.errorMessage = 'Invalid email or password. Please try again.';
    }
  }

  redirectUser(role: string) {
    if (role === 'client') {
      this.router.navigate(['/client']);
    } else if (role === 'manager') {
      this.router.navigate(['/manager']);
    } else if (role === 'staff') {
      this.router.navigate(['/staff']);
    } else {
      this.errorMessage = 'Unknown role. Please contact support.';
    }
  }
}
