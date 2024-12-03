import { Routes } from "@angular/router";
import { ManagerDashboardComponent } from "./manager-dashboard/manager-dashboard.component";
import { LoanCategoryComponent } from "./loan-category/loan-category.component";
import { StaffPerformanceComponent } from "./staff-performance/staff-performance.component";
import { UserRolesComponent } from "./user-roles/user-roles.component";
import { ViewReportsComponent } from "./view-reports/view-reports.component";
import { EmployeePayrollComponent } from "./employee-payroll/employee-payroll.component";
import { ManagerNavbarComponent } from "../Navbar/manager-navbar/manager-navbar.component";
import { ManagerComponent } from "./manager/manager.component";

export const MANAGER_ROUTES :Routes = [
    {path:'', redirectTo: 'manager-dashboard', pathMatch: 'full'},
    {path:'manager-dashboard', component:ManagerDashboardComponent},
    {path:'loan-category', component:LoanCategoryComponent},
    {path:'manager-staff-performance', component:StaffPerformanceComponent},
    {path:'manager-user-role', component:UserRolesComponent},
    {path:'manager-report', component:ViewReportsComponent},
    {path:'manager-payroll', component:EmployeePayrollComponent},

  
]