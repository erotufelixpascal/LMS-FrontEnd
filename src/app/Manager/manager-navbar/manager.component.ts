import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-manager-navbar',
    imports: [
        RouterLink,
        MatIconModule
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
