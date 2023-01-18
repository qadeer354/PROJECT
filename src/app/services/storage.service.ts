import { Injectable } from '@angular/core';
import { User } from 'firebase/auth';
import { StorageKeys } from '../helpers/enum';
import { RoutingService } from './routing.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private routing: RoutingService) {}
  getProperty(key: string) {
    var val: any = window.localStorage.getItem(key);
    if (val != 'undefined') {
      return JSON.parse(val);
    } else {
      return val;
    }
  }

  setProperty(key: string, value: any, parse = true) {
    if (parse) {
      window.localStorage.setItem(key, JSON.stringify(value));
    } else {
      window.localStorage.setItem(key, value);
    }
  }

  removeProperty(key: string) {
    window.localStorage.removeItem(key);
    return true;
  }

  removeAllProperties() {
    window.localStorage.clear();
    return true;
  }

  setUser(user: User) {
    this.setProperty(StorageKeys.user, user);
  }

  setToken(token: string) {
    this.setProperty(StorageKeys.token, token);
  }

  get User(): User {
    return this.getProperty(StorageKeys.user);
  }

  get Token(): User {
    return this.getProperty(StorageKeys.token);
  }

  logout() {
    this.removeAllProperties();
    this.routing.goToLogin(true);
  }
}
