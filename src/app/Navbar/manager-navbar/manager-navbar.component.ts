import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-manager-navbar',
  standalone: true,
  imports: [
    MatTooltipModule
  ],
  templateUrl: './manager-navbar.component.html',
  styleUrl: './manager-navbar.component.scss'
})
export class ManagerNavbarComponent {

}
