import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, signal, inject, ViewChild, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

interface StaffPerformance {
  staffID?: string;
  firstName?: string;
  lastName?: string;
  loans_applied?: number;
  loans_pending?: number;
  loans_disbursed?: number;
  loans_recovered?: number;
  effectiveness?: number;
  totalAmount?: number;
  recoveredAmount?: number;
}

@Component({
    selector: 'app-staff-performance',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatTooltipModule,
        MatTableModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatPaginatorModule
    ],
    providers: [DatePipe],
    templateUrl: './staff-performance.component.html',
    styleUrl: './staff-performance.component.scss'
})
export class StaffPerformanceComponent implements OnInit, AfterViewInit {
  
  router = inject(Router);
  dataService = inject(CommonService);
  datePipe = inject(DatePipe);

  staffForm: FormGroup;
  currentDateTime: string = "";
  staffList = signal<any[]>([]);
  staffPerformanceList = signal<StaffPerformance[]>([]);
  
  displayedColumns: string[] = [
    'firstName', 
    'lastName', 
    'loans_applied', 
    'loans_pending', 
    'loans_disbursed', 
    'loans_recovered', 
    'effectiveness'
  ];
  
  dataSource = new MatTableDataSource<StaffPerformance>([]);
  filteredDataSource = new MatTableDataSource<StaffPerformance>([]);
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Statistics
  totalStaff = signal<number>(0);
  totalLoansApplied = signal<number>(0);
  totalLoansDisbursed = signal<number>(0);
  totalLoansRecovered = signal<number>(0);
  averageEffectiveness = signal<number>(0);

  constructor(
    private fb: FormBuilder
  ) {
    this.currentDateTime = this.datePipe.transform(new Date(), 'fullDate') + ' ' + this.datePipe.transform(new Date(), 'shortTime');
    this.staffForm = this.fb.group({
      staffID: ["", Validators.required],
      searchTerm: [""]
    });
  }

  ngOnInit(): void {
    this.loadStaffList();
    this.loadStaffPerformance();
  }

  ngAfterViewInit(): void {
    this.filteredDataSource.sort = this.sort;
    this.filteredDataSource.paginator = this.paginator;
  }

  loadStaffList(): void {
    this.dataService.getStaffList().subscribe({
      next: (data) => {
        this.staffList.set(data || []);
      },
      error: (error) => {
        console.error('Error fetching staff list:', error);
      }
    });
  }

  loadStaffPerformance(): void {
    this.dataService.getStatistics().subscribe({
      next: (data) => {
        const performanceData = Array.isArray(data) ? data : [data];
        this.staffPerformanceList.set(performanceData);
        this.dataSource.data = performanceData;
        this.filteredDataSource.data = performanceData;
        this.calculateStatistics(performanceData);
      },
      error: (error) => {
        console.error('Error fetching staff performance:', error);
      }
    });
  }

  calculateStatistics(data: StaffPerformance[]): void {
    if (!data || data.length === 0) return;

    this.totalStaff.set(data.length);
    
    const totalApplied = data.reduce((sum, staff) => sum + (staff.loans_applied || 0), 0);
    const totalDisbursed = data.reduce((sum, staff) => sum + (staff.loans_disbursed || 0), 0);
    const totalRecovered = data.reduce((sum, staff) => sum + (staff.loans_recovered || 0), 0);
    const totalEffectiveness = data.reduce((sum, staff) => sum + (staff.effectiveness || 0), 0);

    this.totalLoansApplied.set(totalApplied);
    this.totalLoansDisbursed.set(totalDisbursed);
    this.totalLoansRecovered.set(totalRecovered);
    this.averageEffectiveness.set(data.length > 0 ? totalEffectiveness / data.length : 0);
  }

  onStaffSelected(): void {
    const selectedStaffID = this.staffForm.get('staffID')?.value;
    if (selectedStaffID) {
      const filtered = this.staffPerformanceList().filter(
        staff => staff.staffID === selectedStaffID
      );
      this.filteredDataSource.data = filtered;
    } else {
      this.filteredDataSource.data = this.staffPerformanceList();
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();

    if (this.filteredDataSource.paginator) {
      this.filteredDataSource.paginator.firstPage();
    }
  }

  clearFilters(): void {
    this.staffForm.patchValue({
      staffID: "",
      searchTerm: ""
    });
    this.filteredDataSource.data = this.staffPerformanceList();
    this.filteredDataSource.filter = "";
  }

  exportToCSV(): void {
    const data = this.filteredDataSource.filteredData.length > 0 
      ? this.filteredDataSource.filteredData 
      : this.filteredDataSource.data;
    
    const headers = this.displayedColumns.join(',');
    const rows = data.map(staff => 
      this.displayedColumns.map(col => {
        const value = staff[col as keyof StaffPerformance];
        return value !== undefined && value !== null ? value : '';
      }).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `staff-performance-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  goToChildRoute(route: string): void {
    this.router.navigate([route]);
  }

  getEffectivenessColor(effectiveness: number | undefined): string {
    if (!effectiveness) return '';
    if (effectiveness >= 80) return 'text-green-600 font-bold';
    if (effectiveness >= 60) return 'text-yellow-600 font-semibold';
    return 'text-red-600';
  }
}
