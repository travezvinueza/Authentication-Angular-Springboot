import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { AuthService } from '../../../core/services/auth.service';
import { CustomMenuItem } from '../../../core/interfaces/CustomMenuItem';
import { AvatarModule } from 'primeng/avatar';

@Component({
    selector: 'app-menu',
    imports: [CommonModule, MenuItemComponent, RouterModule, AvatarModule ],
    templateUrl: './menu.component.html'
})
export class MenuComponent {
    private readonly authService = inject(AuthService);

    isAuthenticate = this.authService.isAuthenticated();
    rolesSignal = this.authService.getRolesSignal();

    userImage = this.isAuthenticate ? this.authService.getUserImage() : '';
    emailSignal = this.isAuthenticate ? this.authService.getEmail() : '';
    model: CustomMenuItem[] = [];

    ngOnInit() {
        const userRoles = this.rolesSignal();
        this.model = [
            {
                label: 'Admin' + (userRoles.includes('ADMIN') ? ' (You)' : ''),
                items: [
                    { label: 'Dashboard', requiredRoles: ['ADMIN'], icon: 'pi pi-fw pi-home', routerLink: ['/admin/dashboard'] },
                    { label: 'Roles', requiredRoles: ['ADMIN'], icon: 'pi pi-fw pi-user', routerLink: ['/admin/role'] },
                    { label: 'Users', requiredRoles: ['ADMIN'], icon: 'pi pi-fw pi-lock', routerLink: ['/admin/user-list'] }
                ]
            },
            {
                label: 'UI Components',
                items: [
                    { label: 'Home', isAuthenticated: true, icon: 'pi pi-fw pi-check-square', routerLink: ['/pages/home'] },
                    { label: 'Crud', isAuthenticated: true, icon: 'pi pi-fw pi-pencil', routerLink: ['/pages/crud'] },
                    { label: 'Landing',  icon: 'pi pi-fw pi-globe', routerLink: ['/pages/landing'] },
                    { label: 'Form Layout', isAuthenticated: true, icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Input', isAuthenticated: true, icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                    { label: 'Button', isAuthenticated: true, icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
                    { label: 'Table', isAuthenticated: true, icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                    { label: 'List', isAuthenticated: true, icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                    { label: 'Tree', isAuthenticated: true, icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                    { label: 'Panel', isAuthenticated: true, icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                    { label: 'Overlay', isAuthenticated: true, icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                    { label: 'Media', isAuthenticated: true, icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                    { label: 'Menu', isAuthenticated: true, icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
                    { label: 'Message', isAuthenticated: true, icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                    { label: 'File', isAuthenticated: true, icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                    { label: 'Chart', isAuthenticated: true, icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                    { label: 'Misc', isAuthenticated: true, icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
                ]
            },
            
            {
                label: 'Get Started',
                items: [
                    {
                        label: 'Documentation',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/documentation']
                    },
                    {
                        label: 'View Source',
                        icon: 'pi pi-fw pi-github',
                        url: 'https://github.com/primefaces/sakai-ng',
                        target: '_blank'
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-fw pi-sign-out',
                        command: () => this.logout()
                    }
                ]
            },
            
        ]

        this.model = this.model.map(menu => ({
            ...menu,
            items: menu.items?.filter(item =>
                (!item['requiredRoles'] || item['requiredRoles'].some((role: string) => userRoles.includes(role))) &&
                (!item['isAuthenticated'] || this.isAuthenticate)
            )
        }));
    }

    logout(): void {
        this.authService.logOut();
    }

}
