import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-manager-navbar',
    imports: [
        RouterOutlet
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
