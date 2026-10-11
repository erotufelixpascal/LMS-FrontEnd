import { Routes } from '@angular/router';
import { LoginComponent } from './Login/login/login.component';
import { SignupComponent } from './Login/signup/signup.component';
import { ManagerComponent } from './Manager/manager-navbar/manager.component';
import { roleGuard, logoutGuard } from './Services/auth.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'logout', component: LoginComponent, canActivate: [logoutGuard] },
    { path: 'signIn', component: SignupComponent },
    { path: 'client', canActivate: [roleGuard('client')], loadChildren: () => import('./Client/client.routes').then(c => c.CLIENT_ROUTES) },
    // Manager is structured differently from Client/Staff: instead of each
    // page embedding its own navbar + flex-row, ManagerComponent IS the
    // navbar and pairs with its own internal <router-outlet> as the
    // flex-row partner for whichever manager page is active.
    { path: 'manager', component: ManagerComponent, canActivate: [roleGuard('manager')], loadChildren: () => import('./Manager/manager.routes').then(r => r.MANAGER_ROUTES) },
    { path: 'staff', canActivate: [roleGuard('staff')], loadChildren: () => import('./Staff/staff.routes').then(r => r.STAFF_ROUTES) },
    { path: '**', redirectTo: '' }
];
