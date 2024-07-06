import { Route, RouterModule, Routes } from '@angular/router';
import { ClientHomeComponent } from './Client/client-home/client-home.component';
import { LoanApplicationComponent } from './Client/loan-application/loan-application.component';
import { LoginComponent } from './Login/login/login.component';
import { LoanCategoryComponent } from './Manager/loan-category/loan-category.component';
import { ManagerDashboardComponent } from './Manager/manager-dashboard/manager-dashboard.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {path:'', component:LoginComponent},
      {path:'application', 
          loadComponent:( )  => import('./Client/loan-application/loan-application.component')
          .then (c => c.LoanApplicationComponent)  
      },
      {path:'manager',
        loadChildren: () => import('./Manager/manager-dashboard/manager.routes') 
        .then(r => r.MANAGER_ROUTES)
    },
      {path:'loan-test', redirectTo: 'loan-category', pathMatch: 'full'},
      {path:'loan-category', component:LoanCategoryComponent}
];
