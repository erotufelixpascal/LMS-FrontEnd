import { Routes } from "@angular/router";
import { StaffDashboardComponent } from "./staff-dashboard/staff-dashboard.component";
import { ReportsComponent } from "./reports/reports.component";
import { LoanManagementComponent } from "./loan-management/loan-management.component";

export const STAFF_ROUTES :Routes = [
    {path:'', redirectTo: 'staff-dashboard', pathMatch: 'full'},
    {path:'staff-dashboard', component:StaffDashboardComponent},
    {path:'loan-management', component:LoanManagementComponent},
    {path:'staff-report', component:ReportsComponent},

  
]