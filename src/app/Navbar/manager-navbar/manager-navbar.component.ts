import { Component, inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MANAGER_ROUTES } from '../../Manager/manager.routes';

@Component({
  selector: 'app-manager-navbar',
  standalone: true,
  imports: [
    MatTooltipModule,
    // RouterModule.forRoot(MANAGER_ROUTES),
    // RouterModule.forRoot([MANAGER_ROUTES])
    // RouterModule.forChild([MANAGER_ROUTES])
  ],
  templateUrl: './manager-navbar.component.html',
  styleUrl: './manager-navbar.component.scss'
})
export class ManagerNavbarComponent {
  router= inject(Router)

  goToChildRoute(route :string ){      
    this.router.navigate([route]);

  }

}
