import { Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, MenuComponent],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  constructor(public el: ElementRef) {}

}