import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private readonly sidebarVisibility: WritableSignal<boolean> = signal(true);

  getSidebarVisibility() {
    return this.sidebarVisibility.asReadonly(); 
  }

  toggleSidebar() {
    this.sidebarVisibility.update((value) => !value);
  }
}
