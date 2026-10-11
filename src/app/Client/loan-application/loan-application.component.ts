import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ClientNavbarComponent } from '../client-navbar/client-navbar.component';
import { LoanCategory } from '../../Services/models/api.models';

@Component({
    selector: 'app-loan-application',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        ClientNavbarComponent
    ],
    providers: [DatePipe],
    templateUrl: './loan-application.component.html',
    styleUrl: './loan-application.component.scss'
})

export class LoanApplicationComponent implements OnInit {
    currentDateTime: string;
    loanForm: FormGroup;
    loanCategories: LoanCategory[] = [];

    loadingCategories = false;
    submitting = false;
    submitError: string | null = null;
    submitSuccess: string | null = null;

    ngOnInit(): void {
        this.loadingCategories = true;
        this.DataService.getLoanCategories().subscribe({
            next: (data) => {
                this.loanCategories = data;
                this.loadingCategories = false;
            },
            error: () => {
                this.loadingCategories = false;
            }
        });
    }

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private DataService: CommonService,
        private datePipe: DatePipe
    ) {
        this.currentDateTime = this.datePipe.transform(new Date(), 'fullDate') + ' ' + this.datePipe.transform(new Date(), 'shortTime');
        this.loanForm = this.formBuilder.group({
            categoryId: ["", Validators.required],
            reason: ["", Validators.required],
            amount: [null, [Validators.required, Validators.min(1)]],
            term: [null, [Validators.required, Validators.min(1)]],
        });
    }

    loanApplication() {
        if (this.loanForm.invalid) {
            return;
        }

        this.submitError = null;
        this.submitSuccess = null;
        this.submitting = true;

        const formData = this.loanForm.value;
        this.DataService.submitLoanApplication({
            categoryId: Number(formData.categoryId),
            amount: Number(formData.amount),
            term: Number(formData.term),
            reason: formData.reason
        }).subscribe({
            next: (data) => {
                this.submitting = false;
                this.submitSuccess = `Application submitted - status: ${data.status}`;
                this.loanForm.reset();
            },
            error: (error) => {
                this.submitting = false;
                this.submitError = error?.error?.message || 'Failed to submit loan application. Please try again.';
            }
        });
    }
}
