import { Routes } from '@angular/router';
import { LoginComponent } from './Login/login/login.component';
import { SignupComponent } from './Login/signup/signup.component';
import { ManagerComponent } from './Manager/manager-navbar/manager.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'logout', component: LoginComponent },
    { path: 'signIn', component: SignupComponent },
    { path: 'client', loadChildren: () => import('./Client/client.routes').then(c => c.CLIENT_ROUTES) },
    { path: 'manager', component: ManagerComponent, loadChildren: () => import('./Manager/manager.routes').then(r => r.MANAGER_ROUTES) },
    { path: 'staff', loadChildren: () => import('./Staff/staff.routes').then(r => r.STAFF_ROUTES) },
    { path: '**', redirectTo: '' }
];
