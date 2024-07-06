import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
//import { routes } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './Login/login/login.component';
import { LoanApplicationComponent } from './Client/loan-application/loan-application.component';
import { LoanCategoryComponent } from './Manager/loan-category/loan-category.component';
import { ManagerDashboardComponent } from './Manager/manager-dashboard/manager-dashboard.component';
import { ClientHomeComponent } from './Client/client-home/client-home.component';
import { BrowserModule } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    // LoginComponent,
    // LoanApplicationComponent,
    // LoanCategoryComponent,
    // ManagerDashboardComponent,
    // LoanApplicationComponent,
    // ClientHomeComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FrontEnd';
}
