import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
    selector: 'app-client-navbar',
    imports: [
        CommonModule,
        MatTooltipModule,
        MatIconModule,
        RouterLink,
    ],
    templateUrl: './client-navbar.component.html',
    styleUrl: './client-navbar.component.scss'
})
export class ClientNavbarComponent {

    router= inject(Router)
    auth = inject(AuthService)

  goToChildRoute(route :string ){
    this.router.navigate([route]);

  }

}
