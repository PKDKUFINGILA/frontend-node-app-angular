import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { rejects } from 'assert';
import { resolve } from 'dns';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = environment.api;
  token: string | null = null;
  userId: string | null = null;
  isAuth$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.initAuth();
  }

  //vérification des informations sur le navigateur
  initAuth(){
    if(typeof localStorage !== "undefined"){
      const authData = localStorage.getItem('auth');
      const data = authData ? JSON.parse(authData): null;
      if (data) {
        if (data.userId && data.token) {
          this.userId = data.userId;
          this.token = data.token;
          this.isAuth$.next(true);
        }
      }
    }
  }
  signup(email: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.post<{ status: number; message: string }>(`${this.api}/users/signup`, { email, password }).subscribe(
        (signupData) => {
          if (signupData.status === 201) {
            // Authentifier l'utilisateur
            this.signin(email, password)
              .then(() => resolve(true))
              .catch(reject);
          } else {
            reject(signupData.message);
          }
        },
        (err) => reject(err)
      );
    });
  }

  signin(email: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.post<{ token: string; userId: string }>(`${this.api}/users/login`, { email, password }).subscribe(
        (authData) => {
          this.token = authData.token;
          this.userId = authData.userId;
          this.isAuth$.next(true);
          //save authData in local
          if (typeof localStorage !== "undefined") {
            localStorage.setItem('auth', JSON.stringify(authData))
          }
          resolve(true);
        },
        (err) => reject(err)
      );
    });
  }

  logout(): void{
    this.isAuth$.next(false);
    this.userId = null;
    this.token = null;
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem('auth');
    }
  }
}
