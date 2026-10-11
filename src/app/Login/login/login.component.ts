import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../Services/auth.service";
import { CommonModule } from "@angular/common";

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
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
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

    this.submitting = true;
    this.auth.login(email, password).subscribe({
      next: () => {
        this.submitting = false;
        this.auth.redirectToHome();
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err?.status === 401
          ? 'Invalid email or password. Please try again.'
          : 'Something went wrong. Please try again.';
      }
    });
  }
}
