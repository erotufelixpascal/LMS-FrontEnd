import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { Payroll, PayrollStatus, User } from '../../Services/models/api.models';

@Component({
    selector: 'app-employee-payroll',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule
    ],
    templateUrl: './employee-payroll.component.html',
    styleUrl: './employee-payroll.component.scss'
})
export class EmployeePayrollComponent implements OnInit {
  currentDateTime: string;

  payrollForm: FormGroup;

  staffList = signal<User[]>([]);
  payrollList = signal<Payroll[]>([]);

  loadingStaff = signal<boolean>(true);
  loadingPayroll = signal<boolean>(true);
  staffError = signal<string | null>(null);
  payrollError = signal<string | null>(null);
  submitError = signal<string | null>(null);
  submitting = signal<boolean>(false);
  updatingId = signal<number | null>(null);

  // Summary derived from the real payroll list
  get totalEntries(): number {
    return this.payrollList().length;
  }

  get totalPending(): number {
    return this.payrollList().filter(p => p.status === 'pending').length;
  }

  get totalPaid(): number {
    return this.payrollList().filter(p => p.status === 'paid').length;
  }

  get totalNetPay(): number {
    return this.payrollList().reduce((sum, p) => sum + (p.netPay || 0), 0);
  }

  constructor(
    private router: Router,
    private DataService: CommonService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) {
    this.currentDateTime = this.datePipe.transform(new Date(), 'fullDate') + ' ' + this.datePipe.transform(new Date(), 'shortTime');
    this.payrollForm = this.fb.group({
      staffId: [null, Validators.required],
      period: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}$/)]],
      baseSalary: [null, [Validators.required, Validators.min(0)]],
      commission: [0, [Validators.min(0)]],
      deductions: [0, [Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadStaffList();
    this.loadPayroll();
  }

  loadStaffList(): void {
    this.loadingStaff.set(true);
    this.staffError.set(null);
    this.DataService.getUsers('staff').subscribe({
      next: (data) => {
        this.staffList.set(data || []);
      },
      error: (error) => {
        console.error('Error fetching staff list:', error);
        this.staffError.set('Unable to load staff list.');
      },
      complete: () => {
        this.loadingStaff.set(false);
      }
    });
  }

  loadPayroll(): void {
    this.loadingPayroll.set(true);
    this.payrollError.set(null);
    this.DataService.getPayroll().subscribe({
      next: (data) => {
        this.payrollList.set(data || []);
      },
      error: (error) => {
        console.error('Error fetching payroll data:', error);
        this.payrollError.set('Unable to load payroll records.');
      },
      complete: () => {
        this.loadingPayroll.set(false);
      }
    });
  }

  staffName(staffId: number): string {
    const staff = this.staffList().find(s => s.id === staffId);
    return staff ? `${staff.firstName} ${staff.lastName}` : `Staff #${staffId}`;
  }

  submitPayroll(): void {
    if (this.payrollForm.invalid) {
      this.payrollForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    const { staffId, period, baseSalary, commission, deductions } = this.payrollForm.value;
    // netPay is always computed server-side - never sent from the client.
    this.DataService.createPayroll({
      staffId: Number(staffId),
      period,
      baseSalary: Number(baseSalary),
      commission: Number(commission) || 0,
      deductions: Number(deductions) || 0
    }).subscribe({
      next: () => {
        this.payrollForm.reset({ staffId: null, period: '', baseSalary: null, commission: 0, deductions: 0 });
        this.loadPayroll();
      },
      error: (error) => {
        console.error('Error creating payroll entry:', error);
        this.submitError.set('Unable to create payroll entry. Please check the form and try again.');
      },
      complete: () => {
        this.submitting.set(false);
      }
    });
  }

  markAsPaid(entry: Payroll): void {
    if (entry.status === 'paid') return;
    this.updatingId.set(entry.id);
    this.DataService.updatePayrollStatus(entry.id, 'paid' as PayrollStatus).subscribe({
      next: () => {
        this.loadPayroll();
      },
      error: (error) => {
        console.error('Error updating payroll status:', error);
        this.payrollError.set('Unable to update payroll status.');
      },
      complete: () => {
        this.updatingId.set(null);
      }
    });
  }

  goToChildRoute(route: string) {
    this.router.navigate([route]);
  }
}
