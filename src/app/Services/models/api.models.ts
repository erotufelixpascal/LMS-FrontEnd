export type UserRole = 'client' | 'staff' | 'manager';
export type UserStatus = 'active' | 'suspended';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  branch: string | null;
  status: UserStatus;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  permissions: string[];
}

export interface LoanCategory {
  id: number;
  name: string;
  description: string | null;
  interestRateMin: number;
  interestRateMax: number;
  termMinMonths: number;
  termMaxMonths: number;
  collateralRequired: boolean;
  createdAt: string;
}

export type LoanApplicationStatus = 'pending' | 'approved' | 'rejected' | 'disbursed';

export interface LoanApplication {
  id: number;
  customerId: number;
  categoryId: number;
  amount: number;
  term: number;
  reason: string;
  status: LoanApplicationStatus;
  appliedAt: string;
  decidedBy: number | null;
  decisionAt: string | null;
  decisionComment: string | null;
}

export type LoanStatus = 'active' | 'closed' | 'defaulted';

export interface Loan {
  id: number;
  applicationId: number;
  principal: number;
  interestRate: number;
  term: number;
  disbursedAt: string;
  outstandingBalance: number;
  status: LoanStatus;
}

export type RepaymentScheduleStatus = 'pending' | 'paid' | 'overdue';

export interface RepaymentSchedule {
  id: number;
  loanId: number;
  installmentNumber: number;
  dueDate: string;
  principalDue: number;
  interestDue: number;
  totalDue: number;
  status: RepaymentScheduleStatus;
}

export interface Payment {
  id: number;
  loanId: number;
  scheduleId: number | null;
  amountPaid: number;
  paidAt: string;
  method: string;
  receivedBy: number | null;
}

export interface Collateral {
  id: number;
  applicationId: number;
  description: string;
  estimatedValue: number;
  documentUrl: string | null;
}

export type PayrollStatus = 'pending' | 'paid';

export interface Payroll {
  id: number;
  staffId: number;
  period: string;
  baseSalary: number;
  commission: number;
  deductions: number;
  netPay: number;
  status: PayrollStatus;
}

export interface Statistics {
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  disbursedApplications: number;
  activeLoans: number;
  closedLoans: number;
  defaultedLoans: number;
  totalPrincipalDisbursed: number;
  totalOutstanding: number;
  totalCollected: number;
}

export interface LoanTerm {
  termMinMonths: number;
  termMaxMonths: number;
}

export interface AuditLogEntry {
  id: number;
  actorId: number | null;
  action: string;
  entityType: string;
  entityId: number | null;
  timestamp: string;
  metadata: Record<string, unknown> | null;
}
