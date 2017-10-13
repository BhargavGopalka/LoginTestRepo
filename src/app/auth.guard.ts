import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot} from '@angular/router';

// @Injectable()
// export class SaveDataGuard implements CanDeactivate<OrganizationDataComponent> {
//   canDeactivate(component: OrganizationDataComponent): boolean {
//     if (component.dataForm.dirty) {
//       const name = component.dataForm.get('name').value;
//       return confirm(`Navigate away and lose all changes to ${name}?`);
//     }
//     return true;
//   }
// }

@Injectable()
export class SaveDataGuard implements CanDeactivate<any> {
  canDeactivate(component: any): boolean {
    if (component.form.dirty) {
      return confirm(`Navigate away and lose all changes`);
    }
    return true;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) {
    const chkToken = sessionStorage.getItem('currentUser');
    if (chkToken && (state.url !== '/' && state.url !== '/login')) {
      return true;
    } else if ((state.url === '/' || state.url === '/login') && !chkToken) {
      return true;
    } else if (chkToken && (state.url === '/' || state.url === '/login')) {
      this.router.navigate(['infoTable']);
      return false;
    }
    this.router.navigate(['login']);
    return false;
  }
}
