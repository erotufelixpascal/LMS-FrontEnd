import { Route } from "@angular/router";
import { ManagerDashboardComponent } from "./manager-dashboard/manager-dashboard.component";
import { LoanCategoryComponent } from "./loan-category/loan-category.component";

export const manager_route: Route[] =[
    {path:'manager-dashboard', component:ManagerDashboardComponent},
    {path:'loan-category', component:LoanCategoryComponent},
]