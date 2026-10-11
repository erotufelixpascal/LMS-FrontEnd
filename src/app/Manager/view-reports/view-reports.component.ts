import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Loan, LoanApplication, LoanCategory } from '../../Services/models/api.models';

interface ReportData {
  id?: number;
  // Identifies who/what the record relates to without fabricating a
  // customer name we don't have (loan applications only expose customerId,
  // loans only expose applicationId).
  reference?: string;
  amount?: number;
  status?: string;
  date?: string;
  category?: string;
}

@Component({
    selector: 'app-view-reports',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatTooltipModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatTabsModule,
        MatTableModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        MatPaginatorModule
    ],
    providers: [DatePipe],
    templateUrl: './view-reports.component.html',
    styleUrl: './view-reports.component.scss'
})
export class ViewReportsComponent implements OnInit {

  router = inject(Router);
  DataService = inject(CommonService);
  datePipe = inject(DatePipe);

  reportForm: FormGroup;
  currentDateTime: string = "";

  // Report types
  reportTypes = [
    { value: 'loan-approval', label: 'Loan Approval Report' },
    { value: 'loan-disbursement', label: 'Loan Disbursement Report' },
    { value: 'loan-closed', label: 'Closed Loans Report' },
    { value: 'loan-pending', label: 'Pending Loans Report' }
  ];

  selectedReportType = signal<string>('loan-approval');

  // Data sources
  loanApprovalData = signal<ReportData[]>([]);
  loanDisbursementData = signal<ReportData[]>([]);
  loanClosedData = signal<ReportData[]>([]);
  loanPendingData = signal<ReportData[]>([]);

  loadingReports = signal<boolean>(true);
  reportsError = signal<string | null>(null);

  // Table configuration
  displayedColumns: string[] = ['id', 'reference', 'amount', 'status', 'date', 'category'];
  dataSource = new MatTableDataSource<ReportData>([]);

  // Filters
  statusOptions = ['All', 'Pending', 'Rejected', 'Disbursed', 'Active', 'Closed', 'Defaulted'];
  categoriesList = signal<LoanCategory[]>([]);
  categoryOptions = signal<string[]>([]);

  constructor(
    private fb: FormBuilder
  ) {
    this.currentDateTime = this.datePipe.transform(new Date(), 'fullDate') + ' ' + this.datePipe.transform(new Date(), 'shortTime');
    this.reportForm = this.fb.group({
      reportType: ['loan-approval', Validators.required],
      status: ['All'],
      category: ['All'],
      startDate: [null],
      endDate: [null],
      searchTerm: ['']
    });
  }

  // Derived values for template
  get totalAmount(): number {
    return (this.dataSource.data || []).reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
  }

  get reportTitle(): string {
    const current = this.reportTypes.find(
      r => r.value === this.selectedReportType()
    );
    return current ? current.label : 'Report';
  }

  ngOnInit(): void {
    this.setupFormListeners();
    // Load categories first so application-based reports can resolve a
    // human-readable category name while mapping.
    this.loadLoanCategories();
  }

  setupFormListeners(): void {
    this.reportForm.get('reportType')?.valueChanges.subscribe(type => {
      this.selectedReportType.set(type);
      this.updateDataSource();
    });

    this.reportForm.get('status')?.valueChanges.subscribe(() => {
      this.applyFilters();
    });

    this.reportForm.get('category')?.valueChanges.subscribe(() => {
      this.applyFilters();
    });

    this.reportForm.get('searchTerm')?.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadLoanCategories(): void {
    this.DataService.getLoanCategories().subscribe({
      next: (data) => {
        const categories = data || [];
        this.categoriesList.set(categories);
        this.categoryOptions.set(['All', ...categories.map(cat => cat.name)]);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
      complete: () => {
        this.loadAllReports();
      }
    });
  }

  private categoryNameById(categoryId: number | undefined): string | undefined {
    if (categoryId === undefined) return undefined;
    return this.categoriesList().find(cat => cat.id === categoryId)?.name;
  }

  private mapApplications(apps: LoanApplication[]): ReportData[] {
    return apps.map(app => ({
      id: app.id,
      reference: `Customer #${app.customerId}`,
      amount: app.amount,
      status: app.status,
      date: app.appliedAt,
      category: this.categoryNameById(app.categoryId)
    }));
  }

  private mapLoans(loans: Loan[]): ReportData[] {
    return loans.map(loan => ({
      id: loan.id,
      reference: `Application #${loan.applicationId}`,
      amount: loan.principal,
      status: loan.status,
      date: loan.disbursedAt
    }));
  }

  loadAllReports(): void {
    this.loadingReports.set(true);
    this.reportsError.set(null);

    // Loan Approval / Pending Report - pending applications
    this.DataService.getLoanApplications().subscribe({
      next: (data) => {
        const pending = (data || []).filter(app => app.status === 'pending');
        const reportData = this.mapApplications(pending);
        this.loanApprovalData.set(reportData);
        this.loanPendingData.set(reportData);
        if (this.selectedReportType() === 'loan-approval' || this.selectedReportType() === 'loan-pending') {
          this.updateDataSource();
        }
      },
      error: (error) => {
        console.error('Error loading loan approval data:', error);
        this.reportsError.set('Unable to load loan application data.');
      },
      complete: () => {
        this.loadingReports.set(false);
      }
    });

    // Loan Disbursement Report - all loans (post-disbursement records)
    this.DataService.getLoans().subscribe({
      next: (data) => {
        const reportData = this.mapLoans(data || []);
        this.loanDisbursementData.set(reportData);
        if (this.selectedReportType() === 'loan-disbursement') {
          this.updateDataSource();
        }
      },
      error: (error) => {
        console.error('Error loading loan disbursement data:', error);
        this.reportsError.set('Unable to load loan disbursement data.');
      }
    });

    // Closed Loans Report
    this.DataService.getLoans('closed').subscribe({
      next: (data) => {
        const reportData = this.mapLoans(data || []);
        this.loanClosedData.set(reportData);
        if (this.selectedReportType() === 'loan-closed') {
          this.updateDataSource();
        }
      },
      error: (error) => {
        console.error('Error loading closed loans data:', error);
        this.reportsError.set('Unable to load closed loans data.');
      }
    });
  }

  updateDataSource(): void {
    let data: ReportData[] = [];

    switch (this.selectedReportType()) {
      case 'loan-approval':
        data = this.loanApprovalData();
        break;
      case 'loan-disbursement':
        data = this.loanDisbursementData();
        break;
      case 'loan-closed':
        data = this.loanClosedData();
        break;
      case 'loan-pending':
        data = this.loanPendingData();
        break;
      default:
        data = [];
    }

    this.dataSource.data = data;
    this.applyFilters();
  }

  applyFilters(): void {
    let filteredData = [...this.dataSource.data];

    // Status filter
    const statusFilter = this.reportForm.get('status')?.value;
    if (statusFilter && statusFilter !== 'All') {
      filteredData = filteredData.filter(item =>
        item.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Category filter
    const categoryFilter = this.reportForm.get('category')?.value;
    if (categoryFilter && categoryFilter !== 'All') {
      filteredData = filteredData.filter(item =>
        item.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Date range filter
    const startDate = this.reportForm.get('startDate')?.value;
    const endDate = this.reportForm.get('endDate')?.value;
    if (startDate) {
      filteredData = filteredData.filter(item => {
        const itemDate = item.date ? new Date(item.date) : null;
        return itemDate && itemDate >= startDate;
      });
    }
    if (endDate) {
      filteredData = filteredData.filter(item => {
        const itemDate = item.date ? new Date(item.date) : null;
        return itemDate && itemDate <= endDate;
      });
    }

    // Search filter
    const searchTerm = this.reportForm.get('searchTerm')?.value?.toLowerCase();
    if (searchTerm) {
      filteredData = filteredData.filter(item =>
        item.reference?.toLowerCase().includes(searchTerm) ||
        item.id?.toString().includes(searchTerm) ||
        item.amount?.toString().includes(searchTerm)
      );
    }

    this.dataSource.data = filteredData;
  }

  clearFilters(): void {
    this.reportForm.patchValue({
      status: 'All',
      category: 'All',
      startDate: null,
      endDate: null,
      searchTerm: ''
    });
    this.updateDataSource();
  }

  exportToCSV(): void {
    const data = this.dataSource.filteredData.length > 0
      ? this.dataSource.filteredData
      : this.dataSource.data;

    const headers = this.displayedColumns.join(',');
    const rows = data.map(item =>
      this.displayedColumns.map(col => {
        const value = item[col as keyof ReportData];
        return value !== undefined && value !== null ? `"${value}"` : '""';
      }).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const reportType = this.reportTypes.find(r => r.value === this.selectedReportType())?.label || 'report';
    link.download = `${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  exportToPDF(): void {
    // This would typically use a PDF library like jsPDF or pdfmake
    console.log('PDF export functionality - to be implemented');
    alert('PDF export functionality will be implemented with a PDF library');
  }

  printReport(): void {
    window.print();
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      this.updateDataSource();
    }
  }

  goToChildRoute(route: string): void {
    this.router.navigate([route]);
  }

  getStatusColor(status: string | undefined): string {
    if (!status) return '';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('disbursed') || statusLower.includes('active')) return 'status-approved';
    if (statusLower.includes('pending')) return 'status-pending';
    if (statusLower.includes('rejected') || statusLower.includes('closed') || statusLower.includes('defaulted')) return 'status-rejected';
    return '';
  }
}
