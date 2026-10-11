import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { LoanCategory } from '../../Services/models/api.models';

@Component({
    selector: 'app-loan-category',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatTabsModule,
    ],
    templateUrl: './loan-category.component.html',
    styleUrl: './loan-category.component.scss'
})
export class LoanCategoryComponent implements OnInit {
    categoryForm: FormGroup;
    categories = signal<LoanCategory[]>([]);
    loading = signal<boolean>(false);
    submitting = signal<boolean>(false);
    errorMessage = signal<string>('');
    successMessage = signal<string>('');

    editingId: number | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private DataService: CommonService
    ) {
        this.categoryForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: [''],
            interestRateMin: [0, [Validators.required, Validators.min(0)]],
            interestRateMax: [0, [Validators.required, Validators.min(0)]],
            termMinMonths: [1, [Validators.required, Validators.min(1)]],
            termMaxMonths: [1, [Validators.required, Validators.min(1)]],
            collateralRequired: [false],
        });
    }

    ngOnInit(): void {
        this.fetchLoanCategories();
    }

    fetchLoanCategories(): void {
        this.loading.set(true);
        this.DataService.getLoanCategories().subscribe({
            next: (data) => {
                this.categories.set(data);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('There was an error fetching the loan categories', error);
                this.errorMessage.set('Failed to load loan categories.');
                this.loading.set(false);
            }
        });
    }

    get rangeInvalid(): boolean {
        const v = this.categoryForm.value;
        return v.interestRateMin != null && v.interestRateMax != null && Number(v.interestRateMin) > Number(v.interestRateMax);
    }

    get termRangeInvalid(): boolean {
        const v = this.categoryForm.value;
        return v.termMinMonths != null && v.termMaxMonths != null && Number(v.termMinMonths) > Number(v.termMaxMonths);
    }

    submitCategory(): void {
        this.errorMessage.set('');
        this.successMessage.set('');

        if (this.categoryForm.invalid) {
            this.categoryForm.markAllAsTouched();
            return;
        }

        const v = this.categoryForm.value;
        const payload = {
            name: v.name,
            description: v.description || undefined,
            interestRateMin: Number(v.interestRateMin),
            interestRateMax: Number(v.interestRateMax),
            termMinMonths: Number(v.termMinMonths),
            termMaxMonths: Number(v.termMaxMonths),
            collateralRequired: !!v.collateralRequired,
        };

        this.submitting.set(true);

        if (this.editingId != null) {
            this.DataService.updateLoanCategory(this.editingId, payload).subscribe({
                next: () => {
                    this.successMessage.set('Loan category updated.');
                    this.submitting.set(false);
                    this.cancelEdit();
                    this.fetchLoanCategories();
                },
                error: (error) => {
                    console.error('Error updating loan category', error);
                    this.errorMessage.set('Failed to update loan category.');
                    this.submitting.set(false);
                }
            });
        } else {
            this.DataService.createLoanCategory(payload).subscribe({
                next: () => {
                    this.successMessage.set('Loan category created.');
                    this.submitting.set(false);
                    this.categoryForm.reset({
                        name: '',
                        description: '',
                        interestRateMin: 0,
                        interestRateMax: 0,
                        termMinMonths: 1,
                        termMaxMonths: 1,
                        collateralRequired: false,
                    });
                    this.fetchLoanCategories();
                },
                error: (error) => {
                    console.error('Error creating loan category', error);
                    this.errorMessage.set('Failed to create loan category.');
                    this.submitting.set(false);
                }
            });
        }
    }

    editCategory(category: LoanCategory): void {
        this.editingId = category.id;
        this.categoryForm.patchValue({
            name: category.name,
            description: category.description || '',
            interestRateMin: category.interestRateMin,
            interestRateMax: category.interestRateMax,
            termMinMonths: category.termMinMonths,
            termMaxMonths: category.termMaxMonths,
            collateralRequired: category.collateralRequired,
        });
    }

    cancelEdit(): void {
        this.editingId = null;
        this.categoryForm.reset({
            name: '',
            description: '',
            interestRateMin: 0,
            interestRateMax: 0,
            termMinMonths: 1,
            termMaxMonths: 1,
            collateralRequired: false,
        });
    }

    deleteCategory(category: LoanCategory): void {
        this.DataService.deleteLoanCategory(category.id).subscribe({
            next: () => {
                this.fetchLoanCategories();
            },
            error: (error) => {
                console.error('Error deleting loan category', error);
                this.errorMessage.set('Failed to delete loan category.');
            }
        });
    }
}
