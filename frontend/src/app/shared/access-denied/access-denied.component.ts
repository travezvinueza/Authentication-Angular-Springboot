import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FloatingConfiguratorComponent } from '../../layout/components/floating-configurator/floating-configurator.component';

@Component({
  selector: 'app-access-denied',
  imports: [ButtonModule, RouterModule, RippleModule, FloatingConfiguratorComponent, ButtonModule],
  templateUrl: './access-denied.component.html'
})
export class AccessDeniedComponent {

}
