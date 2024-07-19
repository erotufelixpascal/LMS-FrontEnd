import { Routes } from "@angular/router";
import { ManagerDashboardComponent } from "./manager-dashboard/manager-dashboard.component";
import { LoanCategoryComponent } from "./loan-category/loan-category.component";
import { StaffPerformanceComponent } from "./staff-performance/staff-performance.component";
import { UserRolesComponent } from "./user-roles/user-roles.component";
import { ViewReportsComponent } from "./view-reports/view-reports.component";

export const MANAGER_ROUTES :Routes = [
    {path:'', redirectTo: 'manager-dashboard', pathMatch: 'full'},
    {path:'manager-dashboard', component:ManagerDashboardComponent},
    {path:'loan-category', component:LoanCategoryComponent},
    {path:'manager-performance', component:StaffPerformanceComponent},
    {path:'manager-user-role', component:UserRolesComponent},
    {path:'manager-report', component:ViewReportsComponent},
    //{path:'manager-dashboard', component:ManagerDashboardComponent}
  
]