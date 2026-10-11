import { CommonModule, DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../Services/common.service';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Role, User, UserRole, UserStatus } from '../../Services/models/api.models';

@Component({
    selector: 'app-user-roles',
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
export class UserRolesComponent {
  createUserForm: FormGroup;
  roles = signal<Role[]>([]);
  users = signal<User[]>([]);
  currentDateTime: string = '';

  loadingUsers = signal<boolean>(false);
  creating = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  // Inline edit state: userId -> draft values
  editingUserId: number | null = null;
  editDraft: { role: UserRole; branch: string | null; status: UserStatus } = {
    role: 'client',
    branch: null,
    status: 'active'
  };

  // Optional: simple role (permission template) management
  roleForm: FormGroup;
  roleSubmitting = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private DataService: CommonService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.currentDateTime = this.datePipe.transform(new Date(), 'fullDate') + ' ' + this.datePipe.transform(new Date(), 'shortTime');

    this.createUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['client', Validators.required],
      branch: [''],
    });

    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });

    this.getUsers();
    this.getRoles();
  }

  getUsers(): void {
    this.loadingUsers.set(true);
    this.DataService.getUsers().subscribe({
      next: (res) => {
        this.users.set(res);
        this.loadingUsers.set(false);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.errorMessage.set('Failed to load users.');
        this.loadingUsers.set(false);
      }
    });
  }

  getRoles(): void {
    this.DataService.getRoles().subscribe({
      next: (res) => {
        this.roles.set(res);
      },
      error: (error) => {
        console.error('Error fetching roles:', error);
      }
    });
  }

  createUser(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    const v = this.createUserForm.value;
    this.creating.set(true);
    this.DataService.createUser({
      firstName: v.firstName,
      lastName: v.lastName,
      email: v.email,
      phone: v.phone,
      password: v.password,
      role: v.role,
      branch: v.branch || null,
    }).subscribe({
      next: () => {
        this.successMessage.set('User created successfully.');
        this.creating.set(false);
        this.createUserForm.reset({ role: 'client', branch: '' });
        this.getUsers();
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.errorMessage.set(error?.error?.message || 'Failed to create user.');
        this.creating.set(false);
      }
    });
  }

  startEdit(user: User): void {
    this.editingUserId = user.id;
    this.editDraft = {
      role: user.role,
      branch: user.branch,
      status: user.status
    };
  }

  cancelEdit(): void {
    this.editingUserId = null;
  }

  saveEdit(user: User): void {
    this.DataService.updateUser(user.id, {
      role: this.editDraft.role,
      branch: this.editDraft.branch,
      status: this.editDraft.status
    }).subscribe({
      next: () => {
        this.editingUserId = null;
        this.getUsers();
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.errorMessage.set('Failed to update user.');
      }
    });
  }

  deleteUser(user: User): void {
    this.DataService.deleteUser(user.id).subscribe({
      next: () => {
        this.getUsers();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.errorMessage.set('Failed to delete user.');
      }
    });
  }

  createRole(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }
    const v = this.roleForm.value;
    this.roleSubmitting.set(true);
    this.DataService.createRole({ name: v.name, description: v.description || '' }).subscribe({
      next: () => {
        this.roleSubmitting.set(false);
        this.roleForm.reset();
        this.getRoles();
      },
      error: (error) => {
        console.error('Error creating role:', error);
        this.roleSubmitting.set(false);
      }
    });
  }

  deleteRole(role: Role): void {
    this.DataService.deleteRole(role.id).subscribe({
      next: () => this.getRoles(),
      error: (error) => console.error('Error deleting role:', error)
    });
  }

  goToChildRoute(route: string) {
    this.router.navigate([route]);
  }
}
