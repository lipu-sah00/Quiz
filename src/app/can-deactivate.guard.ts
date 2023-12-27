import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Promise<boolean> | Observable<boolean>;
}

export type CanDeactivateFn = (
  component: CanComponentDeactivate,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState?: RouterStateSnapshot
) => boolean | Promise<boolean> | Observable<boolean>;

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard
  implements CanDeactivate<CanComponentDeactivate>
{
  async canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Promise<boolean> {
    if (component.canDeactivate) {
      const userChoice = await component.canDeactivate();

      // Perform actions based on user's choice
      if (userChoice) {
        console.log('User pressed OK. Allowing navigation.');
        return true;
      } else {
        console.log('User pressed Cancel. Blocking navigation.');
        return false;
      }
    }

    return true;
  }
}
