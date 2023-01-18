import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FirebaseService } from './services/firebase.service';
import { StorageService } from './services/storage.service';
import { UtilService } from './services/util.service';
import { RoutingService } from './services/routing.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FirebaseService,
    StorageService,
    UtilService,
    RoutingService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
