import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const orderGuard: CanActivateFn = (route, state) => {
  const orderService = inject(OrderService);
  const router = inject(Router);

  var token = route.params['orderToken'];
  return orderService.getOrderExists(token).pipe(
    map((orderExists) => {
      if (orderExists) {
        return true;
      }
      const errorPath = router.parseUrl('/error');
      return new RedirectCommand(errorPath, {
        skipLocationChange: true
      });
    })
  );
};
