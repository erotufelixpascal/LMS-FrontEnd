import { Component } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../Services/auth.service";

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage = '';
  submitting = false;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.signupForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: passwordMatchValidator }
    );
  }

  register() {
    this.errorMessage = '';

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { confirmPassword, ...userData } = this.signupForm.value;
    const email = userData.email.trim().toLowerCase();

    this.submitting = true;
    this.auth.register({ ...userData, email }).subscribe({
      next: () => {
        this.submitting = false;
        this.auth.redirectToHome();
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err?.status === 409
          ? 'An account with this email already exists.'
          : (err?.error?.message || 'Something went wrong. Please try again.');
      }
    });
  }
}
