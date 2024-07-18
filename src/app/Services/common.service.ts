import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
// import { loanApplications, loanApplicationValidator } from './models/loanApplication';
// import {category, categoryValidator} from './models/category';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
    apiURL: string = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) { }
  getUsers() {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.get<any>(this.apiURL + "/users");
  }

  getUserRole( customerID: string) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.get<any>(this.apiURL + "/users/customerID");
    //return this.http.get<any>(`${this.apiURL}/users/${customerID}`, { headers });
  }

  loanApplication( amount: number, reason: string,status: string, term: number, interestRate: number, customerID: string, category: string ){
    const headers = new HttpHeaders({
        "Content-Type": "application/json",
      });
      return this.http.post<any>(this.apiURL + "/loan-application",
      {
        dirty: Boolean,
        //data: loanApplication,
        amount: amount, 
        reason: reason,
        status: status, 
        term: term, 
        //appliedAt: appliedAt,
        interestRate: interestRate, 
        customerID: customerID, 
        category: category
      },
      { headers }
    )
    .pipe(
      catchError((error) => {
        console.error("Error occurred:", error);
        return throwError(error);
      })
    );
  }

  selectCustomerID() {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.get<any>(this.apiURL + "/users");
  }

  selectloanCategory() {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.get<any>(this.apiURL + "/loan-categories");
  }
  category(loanName: string) {
        const headers = new HttpHeaders({
            "Content-Type": "application/json",
          });
          return this.http.post<any>(this.apiURL + "/loan-categories",
          {
            dirty: Boolean,
            // data: category,
            loanName: loanName
          },
          { headers }
        )
        .pipe(
          catchError((error) => {
            console.error("Error occurred:", error);
            return throwError(error);
          })
        );
      }
      getLoanCategories() {
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
        });
        return this.http.get<any>(this.apiURL + "/loan-categories");
      }

      loanTerms() {
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
        });
        return this.http.get<any>(this.apiURL + "/loan-terms");
      }

}
