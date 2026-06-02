import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-staff-navbar',
    imports: [RouterOutlet],
    templateUrl: './staff-navbar.component.html',
    styleUrl: './staff-navbar.component.scss'
})
export class StaffNavbarComponent {

  router= inject(Router)

  goToChildRoute(route :string ){      
    this.router.navigate([route]);

  }
}
