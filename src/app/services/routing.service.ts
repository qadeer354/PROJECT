import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RoutePath } from '../helpers/enum';
import { Location } from '@angular/common'

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  constructor(private location: Location,private router: Router) {}

  goBack(){
    this.location.back()
  }

  goToLogin(replaceUrl: boolean = false) {
    this.route(RoutePath.login, replaceUrl);
  }

  goToHome(replaceUrl: boolean = false) {
    this.route(RoutePath.home, replaceUrl);
  }

  goToChatScreen(uid: string) {
    this.route(`${RoutePath.chat}/${uid}`);
  }

  route(path: string, replaceUrl: boolean = false, data?: any) {
    if (!data) {
      this.router.navigate([path], { replaceUrl: replaceUrl });
    } else {
      this.router.navigate([path], {
        replaceUrl: replaceUrl,
        queryParams: data,
      });
    }
  }
}
