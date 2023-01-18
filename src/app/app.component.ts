import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { RoutingService } from './services/routing.service';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private firebase: FirebaseService,private storage: StorageService,private routing: RoutingService) {}

  async ngOnInit() {
    await this.firebase.initialize();
    if(this.storage.Token && location.pathname.includes("login")){
      this.routing.goToHome();
    }
  }
}
