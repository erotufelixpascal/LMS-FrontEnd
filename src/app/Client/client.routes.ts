import { Routes } from "@angular/router";
import { LoanApplicationComponent } from "./loan-application/loan-application.component";
import { LoanRepaymentComponent } from "./loan-repayment/loan-repayment.component";
import { ClientHomeComponent } from "./client-home/client-home.component";

export const CLIENT_ROUTES :Routes = [
    {path:'', redirectTo: 'client-home', pathMatch: 'full'},
    {path:'client-home', component:ClientHomeComponent,
       children:[
        {path:'', redirectTo: 'client-home', pathMatch: 'full'},
        {path:'loan-application', component:LoanApplicationComponent},
        {path:'loan-repayment', component:LoanRepaymentComponent}
       ]
},    
]