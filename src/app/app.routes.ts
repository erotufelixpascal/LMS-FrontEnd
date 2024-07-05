import { Route } from '@angular/router';
import { ClientHomeComponent } from './Client/client-home/client-home.component';
import { LoanApplicationComponent } from './Client/loan-application/loan-application.component';
import { LoginComponent } from './Login/login/login.component';
import { LoanCategoryComponent } from './Manager/loan-category/loan-category.component';
import { ManagerDashboardComponent } from './Manager/manager-dashboard/manager-dashboard.component';

export const APP_ROUTE: Route[] = [
    {path:'', component:ManagerDashboardComponent},
        
];
