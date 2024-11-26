import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler){
    const token = this.auth.token;
    //Creation d'une nouvelle requête
    const newRequest = request.clone({
      headers: request.headers.set('Authorization', 'Bearer '+token)
    })
    return next.handle(newRequest);
  }
}
