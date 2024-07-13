import { Route, RouterModule, Routes } from '@angular/router';
import { ClientHomeComponent } from './Client/client-home/client-home.component';
import { LoanApplicationComponent } from './Client/loan-application/loan-application.component';
import { LoginComponent } from './Login/login/login.component';
import { LoanCategoryComponent } from './Manager/loan-category/loan-category.component';
import { ManagerDashboardComponent } from './Manager/manager-dashboard/manager-dashboard.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {path:'', component:LoginComponent},
    //{path:'settings', component:   },
    {path:'loan-test', redirectTo: 'loan-category', pathMatch: 'full'},
    {path:'loan-category', component:LoanCategoryComponent},
    {path:'logout', component:LoginComponent},
    {path:'', 
          loadChildren:( )  => import('./Client/client.routes')
          .then (c => c.CLIENT_ROUTES)  
    },
    {path:'manager',
        loadChildren: () => import('./Manager/manager.routes') 
        .then(r => r.MANAGER_ROUTES)
    },
];
