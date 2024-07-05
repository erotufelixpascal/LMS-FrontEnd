import { RouterModule, Routes } from '@angular/router';
import { LoanApplicationComponent } from './Client/loan-application/loan-application.component';
import { LoanCategoryComponent } from './Manager/loan-category/loan-category.component';
import { ClientHomeComponent } from './Client/client-home/client-home.component';
import { ManagerDashboardComponent } from './Manager/manager-dashboard/manager-dashboard.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './Login/login/login.component';

export const routes: Routes = [
    {path:'', component:LoginComponent},
    {path:'loan-application', component:LoanApplicationComponent},
    {path:'loan-category', component:LoanCategoryComponent},
    {path:'client-home', component:ClientHomeComponent},
    {path:'manager-dashboard', component:ManagerDashboardComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}