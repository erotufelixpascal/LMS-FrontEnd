import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-staff-navbar',
    imports: [RouterLink, MatIconModule],
    templateUrl: './staff-navbar.component.html',
    styleUrl: './staff-navbar.component.scss'
})
export class StaffNavbarComponent {

  router= inject(Router)

  goToChildRoute(route :string ){      
    this.router.navigate([route]);

  }
}
