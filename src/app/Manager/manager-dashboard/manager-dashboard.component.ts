import{ Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
// import { AppRoutingModule } from '../../app-routing.module';
// import { AppRoutingModule } from '../../app.routes';
import { LoanApplicationComponent } from '../../Client/loan-application/loan-application.component';
import { LoginComponent } from '../../Login/login/login.component';
import { LoanCategoryComponent } from '../loan-category/loan-category.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    // BrowserAnimationsModule,
    // ReactiveFormsModule,
    // FormsModule,
  // LoanApplicationComponent,
  // LoginComponent,
  // LoanCategoryComponent
],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss'
})

export class ManagerDashboardComponent implements OnInit{

    constructor (
        private router: Router
    ){ }

    ngOnInit(): void {}

    goToChildRoute(route :string ){
        this.router.navigate([route]);
      }

}
