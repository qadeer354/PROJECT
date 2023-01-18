import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { FirebaseService } from '../services/firebase.service';
import { RoutingService } from '../services/routing.service';
import { StorageService } from '../services/storage.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  users: User[] = [];
  currentUser?: User;

  constructor(private firebase: FirebaseService,private routing: RoutingService,public util : UtilService,private storage : StorageService) {}

  async ngOnInit() {
    this.users = await this.firebase.getAllUsers();
    this.currentUser = this.storage.User;
  }

  goToChatScreen(user: User) {
    this.routing.goToChatScreen(user.uid!);
  }

  logout(){
    this.storage.logout();
  }
}
