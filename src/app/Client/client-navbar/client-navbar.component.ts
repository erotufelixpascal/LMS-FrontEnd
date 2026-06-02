import { Component, inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-client-navbar',
    imports: [
        MatTooltipModule,
        // RouterOutlet
    ],
    templateUrl: './client-navbar.component.html',
    styleUrl: './client-navbar.component.scss'
})
export class ClientNavbarComponent {

    router= inject(Router)

  goToChildRoute(route :string ){      
    this.router.navigate([route]);

  }

}
