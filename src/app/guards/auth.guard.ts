import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { UtilService } from '../services/util.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(public storage: StorageService,private util : UtilService) {}

  async canActivate(): Promise<boolean> {
    if (!this.storage.Token) {
      this.util.showToast("Please! Login To Continue");
      this.storage.logout();
      return false;
    } else {
      return true;
    }
  }
}
