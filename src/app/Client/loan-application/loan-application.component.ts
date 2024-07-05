import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../../app-routing.module';

@Component({
  selector: 'app-loan-application',
  standalone: true,
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule],
  templateUrl: './loan-application.component.html',
  styleUrl: './loan-application.component.scss'
})

export class LoanApplicationComponent implements OnInit{
    loanForm: FormGroup
    loanCategory: string=""
    loanReason: string=""
    amount: number = 0
    interestRate: number = 0
    term: number = 0
    //loanSecurity: string=""
    status: string=""
    appliedAt: string=""
    customerID :string=""
    loanApplicationData!: string[];
    customerIDs : any[] = [];
    loanCategorys : any[] = [];

    ngOnInit(): void { 
        this.DataService.selectCustomerID( ).subscribe((data) => {
            this.customerIDs = data;
          });
          this.DataService.selectloanCategory( ).subscribe((data) => {
            this.loanCategorys = data;
          });
    }

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private DataService: CommonService
    ){
        this.loanForm = this.formBuilder.group({
            loanCategory: ["", Validators.required],
            loanReason: ["", Validators.required],
            amount: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
            term: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
            //loanSecurity: ["", Validators.required],
            status: ["", Validators.required],
            appliedAt : ["", Validators.required],
            interestRate:[null, [Validators.required, Validators.pattern(/^\d+$/)]],
            customerID :["", Validators.required],
        })
    }
    loanApplication(amount: number, reason: string,status: string, term: number,interestRate: number, customerID: string, category: string){
        if (this.loanForm.valid) {
            console.log(this.loanForm.value);
            const formData = this.loanForm.value;
        this.DataService.loanApplication(
            formData.amount,
            formData.loanReason,
            formData.status,
            formData.term,
            formData.interestRate,
            formData.customerID,
            formData.loanCategory
        ).subscribe((data) => {
            console.log('Sending data to backend:', data); // Add this line for logging
            this.loanApplicationData = data;
        })
    }
}


}

