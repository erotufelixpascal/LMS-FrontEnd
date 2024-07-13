import { Routes } from "@angular/router";
import { ManagerDashboardComponent } from "./manager-dashboard/manager-dashboard.component";
import { LoanCategoryComponent } from "./loan-category/loan-category.component";

export const MANAGER_ROUTES :Routes = [
    {path:'', redirectTo: 'manager', pathMatch: 'full'},
    {path:'manager', component:ManagerDashboardComponent,
       children:[
        {path:'', redirectTo: 'manager-dashboard', pathMatch: 'full'},
        {path:'loan-category', component:LoanCategoryComponent},
        {path:'manager-dashboard', component:ManagerDashboardComponent}
       ]
},    
]