import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  name: string = "";

  constructor(private util : UtilService,private firebase: FirebaseService) {}

  ngOnInit() {}

  signInUsingGoogle(){
    this.firebase.authenticateWithGoogle();
  }

  signInAnonymously(){
    if(this.name.length){
      this.firebase.authenticateWithFirebaseGuest(this.name);
    }else{
      this.util.showToast("Enter Name to continue");
    }
  }

}
