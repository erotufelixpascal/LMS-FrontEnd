import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-manager-navbar',
    imports: [
        RouterOutlet,
        RouterLink
    ],
    templateUrl: './manager.component.html',
    styleUrl: './manager.component.scss'
})
export class ManagerComponent {

  router= inject(Router)

  goToChildRoute(route :string ){      
    this.router.navigate([route]);

  }
}
