import { inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpRequest,
  HttpXsrfTokenExtractor,
  HttpHandlerFn
} from '@angular/common/http';
import { Observable } from 'rxjs';

export function csrfInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS', 'TRACE'];

  if (safeMethods.includes(req.method)) {
    return next(req);
  }
  const token = inject(HttpXsrfTokenExtractor).getToken() as string;
  if (token) {
    req = req.clone({
      withCredentials: true,
      headers: req.headers.set('X-Xsrf-Header', token)
    });
  }
  return next(req);
}
