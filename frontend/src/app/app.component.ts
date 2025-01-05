import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastModule } from 'primeng/toast';
import { ExpiringSessionComponent } from './shared/expiring-session/expiring-session.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, NavbarComponent, RouterModule, ExpiringSessionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
