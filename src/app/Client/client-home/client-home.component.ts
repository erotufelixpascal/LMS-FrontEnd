import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule
  ],
  templateUrl: './client-home.component.html',
  styleUrl: './client-home.component.scss'
})
export class ClientHomeComponent implements OnInit{
  clientForm: FormGroup;
  Name: string = "";
  RelationshipFor: string = "";
  Active: boolean = false;
  Order!: number;
  courseID: string | null = "";
  courseIDInt: number = 0;
  participantRelationships: any = [];
  formSubmitted: boolean = false;
  userPID: string | null = "";
  userPIDInt: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private DataService: CommonService
   ){
    this.clientForm = this.fb.group({
      Name: ["", Validators.required],
      RelationshipFor: ["", Validators.required],
      Active: [false],
      Order: [
        null,
        [Validators.required, Validators.min(1), Validators.max(7)],
      ],
      Archive: [false],
    });
   }

  ngOnInit(): void {}

  goToChildRoute(route :string ){
    this.router.navigate([route]);
  }

  



}
