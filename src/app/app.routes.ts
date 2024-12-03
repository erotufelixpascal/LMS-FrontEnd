import { Routes } from '@angular/router';
import { LoginComponent } from './Login/login/login.component';
import { ManagerComponent } from './Manager/manager/manager.component';


export const routes: Routes = [
    {path:'loan-test', redirectTo: 'loan-category', pathMatch: 'full'},
    {path:'', component:LoginComponent},
    //{path:'settings', component:   },
    {path:'logout', component:LoginComponent},
    {path:'client',  loadChildren:( )  => import('./Client/client.routes').then (c => c.CLIENT_ROUTES)},
    {path:'manager', component:ManagerComponent, loadChildren: () => import('./Manager/manager.routes').then(r => r.MANAGER_ROUTES)},
    // {path:'staff', loadChildren: () => import('./Staff/staff.routes').then(b => b.STAFF_ROUTES)}
    {path:'staff', loadChildren: ()=> import('./Staff/staff.routes').then(r => r.STAFF_ROUTES)}
];
