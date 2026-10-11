import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './Core/Footer/footer.component';
import { ClientNavbarComponent } from './Client/client-navbar/client-navbar.component';
import { StaffNavbarComponent } from './Staff/staff-navbar/staff-navbar.component';
import { ManagerComponent } from './Manager/manager-navbar/manager.component';
import { AuthService } from './Services/auth.service';

@Component({
    selector: 'app-root',
    imports: [
        CommonModule,
        RouterOutlet,
        FooterComponent,
        ClientNavbarComponent,
        StaffNavbarComponent,
        ManagerComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FrontEnd';
  private auth = inject(AuthService);
  // Was a signal that nothing ever set, so the role-based navbar never
  // rendered - now driven by the logged-in user's actual role. Gated on
  // isLoggedIn() (requires a real token), not just currentUser() alone -
  // otherwise a stale currentUser left in localStorage from testing before
  // a token existed would render a navbar with no actual session (this
  // showed up live: the manager navbar appeared on the login page itself).
  role = computed(() => (this.auth.isLoggedIn() ? (this.auth.currentUser()?.role ?? '') : ''));
}
