import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-client-navbar',
    imports: [
        MatTooltipModule
    ],
    templateUrl: './client-navbar.component.html',
    styleUrl: './client-navbar.component.scss'
})
export class ClientNavbarComponent {

}
