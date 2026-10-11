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
import { User } from '../../Services/models/api.models';

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
  staffList = signal<User[]>([]);
  loadingStaff = signal<boolean>(true);
  staffError = signal<string | null>(null);

  // There is no backend endpoint yet for per-staff performance metrics
  // (loans applied/pending/disbursed/recovered, effectiveness %). This screen
  // shows the real staff roster instead of fabricating those numbers.
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'branch',
    'status'
  ];

  dataSource = new MatTableDataSource<User>([]);
  filteredDataSource = new MatTableDataSource<User>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Statistics (real, derived from the staff roster only)
  totalStaff = signal<number>(0);
  activeStaff = signal<number>(0);
  suspendedStaff = signal<number>(0);

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
  }

  ngAfterViewInit(): void {
    this.filteredDataSource.sort = this.sort;
    this.filteredDataSource.paginator = this.paginator;
  }

  loadStaffList(): void {
    this.loadingStaff.set(true);
    this.staffError.set(null);
    this.dataService.getUsers('staff').subscribe({
      next: (data) => {
        const staff = data || [];
        this.staffList.set(staff);
        this.dataSource.data = staff;
        this.filteredDataSource.data = staff;
        this.calculateStatistics(staff);
      },
      error: (error) => {
        console.error('Error fetching staff list:', error);
        this.staffError.set('Unable to load the staff list.');
      },
      complete: () => {
        this.loadingStaff.set(false);
      }
    });
  }

  calculateStatistics(data: User[]): void {
    this.totalStaff.set(data.length);
    this.activeStaff.set(data.filter(staff => staff.status === 'active').length);
    this.suspendedStaff.set(data.filter(staff => staff.status === 'suspended').length);
  }

  onStaffSelected(): void {
    const selectedStaffID = this.staffForm.get('staffID')?.value;
    if (selectedStaffID) {
      const filtered = this.staffList().filter(
        staff => String(staff.id) === String(selectedStaffID)
      );
      this.filteredDataSource.data = filtered;
    } else {
      this.filteredDataSource.data = this.staffList();
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
    this.filteredDataSource.data = this.staffList();
    this.filteredDataSource.filter = "";
  }

  exportToCSV(): void {
    const data = this.filteredDataSource.filteredData.length > 0
      ? this.filteredDataSource.filteredData
      : this.filteredDataSource.data;

    const headers = this.displayedColumns.join(',');
    const rows = data.map(staff =>
      this.displayedColumns.map(col => {
        const value = staff[col as keyof User];
        return value !== undefined && value !== null ? value : '';
      }).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `staff-list-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  goToChildRoute(route: string): void {
    this.router.navigate([route]);
  }
}
