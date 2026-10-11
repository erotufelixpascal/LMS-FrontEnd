import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  AuditLogEntry,
  Collateral,
  Loan,
  LoanApplication,
  LoanApplicationStatus,
  LoanCategory,
  LoanStatus,
  LoanTerm,
  Payment,
  Payroll,
  PayrollStatus,
  RepaymentSchedule,
  Role,
  Statistics,
  User,
  UserRole,
} from './models/api.models';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private http = inject(HttpClient);
  private base = environment.apiURL;

  // Users
  getUsers(role?: UserRole) {
    const query = role ? `?role=${role}` : '';
    return this.http.get<User[]>(`${this.base}/users${query}`);
  }

  getUser(id: number) {
    return this.http.get<User>(`${this.base}/users/${id}`);
  }

  createUser(payload: { firstName: string; lastName: string; email: string; phone: string; password: string; role: UserRole; branch?: string | null }) {
    return this.http.post<User>(`${this.base}/users`, payload);
  }

  updateUser(id: number, payload: Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'email' | 'role' | 'branch' | 'status'>>) {
    return this.http.patch<User>(`${this.base}/users/${id}`, payload);
  }

  deleteUser(id: number) {
    return this.http.delete<void>(`${this.base}/users/${id}`);
  }

  // Roles (permission templates - separate from the client/staff/manager auth role)
  getRoles() {
    return this.http.get<Role[]>(`${this.base}/role`);
  }

  createRole(payload: { name: string; description: string; permissions?: string[] }) {
    return this.http.post<Role>(`${this.base}/role`, payload);
  }

  updateRole(id: number, payload: Partial<{ name: string; description: string; permissions: string[] }>) {
    return this.http.patch<Role>(`${this.base}/role/${id}`, payload);
  }

  deleteRole(id: number) {
    return this.http.delete<void>(`${this.base}/role/${id}`);
  }

  // Loan categories
  getLoanCategories() {
    return this.http.get<LoanCategory[]>(`${this.base}/loan-categories`);
  }

  createLoanCategory(payload: { name: string; description?: string; interestRateMin: number; interestRateMax: number; termMinMonths: number; termMaxMonths: number; collateralRequired?: boolean }) {
    return this.http.post<LoanCategory>(`${this.base}/loan-categories`, payload);
  }

  updateLoanCategory(id: number, payload: Partial<LoanCategory>) {
    return this.http.patch<LoanCategory>(`${this.base}/loan-categories/${id}`, payload);
  }

  deleteLoanCategory(id: number) {
    return this.http.delete<void>(`${this.base}/loan-categories/${id}`);
  }

  // Loan applications
  submitLoanApplication(payload: { categoryId: number; amount: number; term: number; reason: string }) {
    return this.http.post<LoanApplication>(`${this.base}/loan-applications`, payload);
  }

  getLoanApplications() {
    return this.http.get<LoanApplication[]>(`${this.base}/loan-applications`);
  }

  getLoanApplication(id: number) {
    return this.http.get<LoanApplication>(`${this.base}/loan-applications/${id}`);
  }

  decideLoanApplication(id: number, payload: { status: Extract<LoanApplicationStatus, 'approved' | 'rejected'>; comment?: string }) {
    return this.http.patch<LoanApplication>(`${this.base}/loan-applications/${id}/decision`, payload);
  }

  // Loans
  getLoans(status?: LoanStatus) {
    const query = status ? `?status=${status}` : '';
    return this.http.get<Loan[]>(`${this.base}/loans${query}`);
  }

  getLoan(id: number) {
    return this.http.get<Loan>(`${this.base}/loans/${id}`);
  }

  getLoanSchedule(id: number) {
    return this.http.get<RepaymentSchedule[]>(`${this.base}/loans/${id}/schedule`);
  }

  // Payments
  makePayment(payload: { loanId: number; scheduleId?: number; amountPaid: number; method: string }) {
    return this.http.post<Payment>(`${this.base}/payments`, payload);
  }

  getPayments() {
    return this.http.get<Payment[]>(`${this.base}/payments`);
  }

  // Collateral
  getCollateral() {
    return this.http.get<Collateral[]>(`${this.base}/collateral`);
  }

  createCollateral(payload: { applicationId: number; description: string; estimatedValue: number; documentUrl?: string }) {
    return this.http.post<Collateral>(`${this.base}/collateral`, payload);
  }

  // Payroll
  getPayroll() {
    return this.http.get<Payroll[]>(`${this.base}/payroll`);
  }

  createPayroll(payload: { staffId: number; period: string; baseSalary: number; commission?: number; deductions?: number }) {
    return this.http.post<Payroll>(`${this.base}/payroll`, payload);
  }

  updatePayrollStatus(id: number, status: PayrollStatus) {
    return this.http.patch<Payroll>(`${this.base}/payroll/${id}`, { status });
  }

  // Reports
  getStatistics() {
    return this.http.get<Statistics>(`${this.base}/reports/statistics`);
  }

  getLoanTerms() {
    return this.http.get<LoanTerm[]>(`${this.base}/reports/loan-terms`);
  }

  getAuditLog() {
    return this.http.get<AuditLogEntry[]>(`${this.base}/reports/audit-log`);
  }
}
