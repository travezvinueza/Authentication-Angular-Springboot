import { Component } from '@angular/core';
import { FloatingConfiguratorComponent } from '../../layout/components/floating-configurator/floating-configurator.component';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-not-found',
  imports: [RouterModule, FloatingConfiguratorComponent, ButtonModule],
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {

}
