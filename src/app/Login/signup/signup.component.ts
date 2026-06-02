import { Component } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

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

  constructor(private fb: FormBuilder, private router: Router) {
    this.signupForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
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

    // Prevent duplicate registrations
    const existing: any[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (existing.some(u => u.email.toLowerCase() === email)) {
      this.errorMessage = 'An account with this email already exists.';
      return;
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      email,
      role: 'client',
      branch: null,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    existing.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existing));

    const { password: _pw, ...safeUser } = newUser;
    localStorage.setItem('currentUser', JSON.stringify(safeUser));

    this.router.navigate(['/client']);
  }
}
