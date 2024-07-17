import{ Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../Services/common.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    // BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,

],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss'
})

export class ManagerDashboardComponent implements OnInit{
  loanCategories: any[]=[];

    constructor (
        private router: Router,
        private DataService:CommonService,
    ){ }

    ngOnInit(): void {
    this.DataService.getLoanCategories().subscribe((res) =>{
      this.loanCategories = res
      // console.log(this.loanCategories)
    })
    }
    goToChildRoute(route :string ){
        this.router.navigate([route]);
      }

}
