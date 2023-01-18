import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  public dummyPhotoUrl : string = "https://firebasestorage.googleapis.com/v0/b/se-project-d26ac.appspot.com/o/dummy-user.png?alt=media&token=4e9da384-5fc2-4408-b076-6876123aa2af";

  constructor(
    private toaster: ToastController,
    private loader: LoadingController
  ) {}

  async showToast(msg: string) {
    const toast = await this.toaster.create({
      message: msg,
      duration: 1000,
    });
    toast.present();
  }

  async showLoader(message?: string) {
    return await this.loader.create({
      message: message ? message : 'Please wait...',
      translucent: true,
    });
  }
}
