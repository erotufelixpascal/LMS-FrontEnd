import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './Core/Footer/footer.component';
import { ClientNavbarComponent } from './Client/client-navbar/client-navbar.component';
import { StaffNavbarComponent } from './Staff/staff-navbar/staff-navbar.component';
import { ManagerComponent } from './Manager/manager-navbar/manager.component';

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
  role = signal('');
}
