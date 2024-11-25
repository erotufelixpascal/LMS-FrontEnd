import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-client-navbar',
  standalone: true,
  imports: [
    MatTooltipModule
  ],
  templateUrl: './client-navbar.component.html',
  styleUrl: './client-navbar.component.scss'
})
export class ClientNavbarComponent {

}
