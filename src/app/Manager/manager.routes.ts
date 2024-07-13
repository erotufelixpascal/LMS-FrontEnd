import { Routes } from "@angular/router";
import { ManagerDashboardComponent } from "./manager-dashboard/manager-dashboard.component";
import { LoanCategoryComponent } from "./loan-category/loan-category.component";

export const MANAGER_ROUTES :Routes = [
    {path:'', redirectTo: 'manager-dashboard', pathMatch: 'full'},
    {path:'manager-dashboard', component:ManagerDashboardComponent,
       children:[
        {path:'', redirectTo: 'loan-category', pathMatch: 'full'},
        {path:'loan-category', component:LoanCategoryComponent}
        // {path:'loan-category', component:LoanCategoryComponent}
       ]
},    
]