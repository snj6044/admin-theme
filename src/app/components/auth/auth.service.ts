import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<any>(null); // token user 
  private loggedIn = new BehaviorSubject<boolean>(false);
  private message: string;

  get currentUser() {
    return this.currentUserSubject.asObservable();
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router) {
    this.message = "";
  }

  login(objUserDetails: any) {
    if (objUserDetails.id == 0) {
      localStorage.removeItem("userDetails");
      this.loggedIn.next(false);
      this.message = "Please enter valid username and password !";
    } else {
      this.currentUserSubject.next(objUserDetails); // for token use
      this.message = "";
      localStorage.setItem("userDetails", JSON.stringify(objUserDetails));
      this.loggedIn.next(true);
      this.router.navigate(['/dashboard/default']);
    }
  }

  logout() {
    localStorage.clear();
    this.loggedIn.next(false);
    this.router.navigate(['/auth/login']);
  }

  getMessage(): string {
    return this.message;
  }

}
