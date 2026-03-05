import { CanActivateFn } from '@angular/router';
import { OrderService } from '../services/order.service';
import { inject } from '@angular/core';

export const orderGuard: CanActivateFn = (route, state) => {
  const orderService = inject(OrderService);
  var token = route.params['orderToken'];
  return orderService.getOrderExists(token);
};
