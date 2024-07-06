import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-loan-category',
  standalone: true,
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
    //AppRoutingModule
  ],
  templateUrl: './loan-category.component.html',
  styleUrl: './loan-category.component.scss'
})



export class LoanCategoryComponent implements OnInit{
    categoryForm: FormGroup
    loanName: string = ""
    Categorys : any[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private DataService: CommonService
    ){
        this.categoryForm = this.formBuilder.group({
            loanName: ["", Validators.required],
        })
     }

    ngOnInit(): void {
        this.fetchLoanCategories();
     }

    Category(loanName: string){
        if (this.categoryForm.valid) {
            // console.log(this.categoryForm.value);
            this.loanName = this.categoryForm.value.loanName;
        this.DataService.category(this.loanName).subscribe((data) => {
            console.log('Sending data to backend:', data); // Add this line for logging
            this.Categorys = data;
        })
      }
    }

    fetchLoanCategories(): void {
        this.DataService.getLoanCategories().subscribe(
          data => {
            this.Categorys = data;
            console.log('Loan categories fetched successfully', data);
          },
          error => {
            console.error('There was an error fetching the loan categories', error);
          }
        );
      }

}

