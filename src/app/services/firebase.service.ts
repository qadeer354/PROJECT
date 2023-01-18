import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import { FirebaseCollections } from '../helpers/enum';
import { Chat } from '../models/chat.model';
import { RoutingService } from './routing.service';
import { StorageService } from './storage.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private firebaseConfig = {
    apiKey: 'AIzaSyDlpYLa9pruxME5G9wVQbUt2h8lsqFUutc',
    authDomain: 'se-project-d26ac.firebaseapp.com',
    projectId: 'se-project-d26ac',
    storageBucket: 'se-project-d26ac.appspot.com',
    messagingSenderId: '740951642203',
    appId: '1:740951642203:web:fa4d0cd09203b58790af7e',
    measurementId: 'G-JYLL27GFEZ',
  };

  constructor(
    private util: UtilService,
    private storage: StorageService,
    private routing: RoutingService
  ) {}

  async initialize() {
    await initializeApp(this.firebaseConfig);
  }

  listenAuthState() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
      } else {
        this.storage.logout();
      }
    });
  }

  getDb() {
    const auth = getAuth();
    return getFirestore(auth.app);
  }

  async authenticateWithFirebaseGuest(name: string) {
    let loader = await this.util.showLoader();
    loader.present();
    const auth = getAuth();
    signInAnonymously(auth)
      .then(async (res) => {
        await updateProfile(res.user, {
          displayName: name,
          photoURL: this.util.dummyPhotoUrl,
        });
        var token = await res.user.getIdToken(true);
        this.storage.setToken(token);
        var user: any = res.user;
        user.displayName = name;
        user.photoURL = this.util.dummyPhotoUrl;
        this.storage.setUser(user);
        this.routing.goToHome(true);
        this.createUser();
        this.util.showToast('Sign in Succesfully');
        loader.dismiss();
      })
      .catch((error) => {
        const errorMessage = error.message;
        loader.dismiss();
        this.util.showToast(errorMessage);
      });
  }

  async authenticateWithGoogle() {
    let loader = await this.util.showLoader();
    loader.present();
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential!.accessToken;
        const user = result.user;
        this.storage.setToken(token!);
        this.storage.setUser(user!);
        this.routing.goToHome(true);
        this.createUser();
        this.util.showToast('Sign in Succesfully');
        loader.dismiss();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        this.util.showToast(errorMessage);
        loader.dismiss();
      });
  }

  async createUser() {
    var user = await this.getUserByUID(this.storage.User.uid);
    if(!user){
      const docRef = await addDoc(
        collection(this.getDb(), FirebaseCollections.users),
        this.storage.User
      );
      console.log('Document written with ID: ', docRef.id);
    }
  }

  async getAllUsers() {
    const q = query(collection(this.getDb(), FirebaseCollections.users));
    const querySnapshot = await getDocs(q);
    var users: User[] = [];
    querySnapshot.forEach(async (doc) => {
      var data: any = await doc.data();
      if (data.uid != this.storage.User.uid) {
        users.push(data);
      }
    });
    return users;
  }

  async getUserByUID(uid: string) {
    const q = query(
      collection(this.getDb(), FirebaseCollections.users),
      where('uid', '==', uid)
    );
    const querySnapshot = await getDocs(q);
    for (let doc of querySnapshot.docs) {
      var data: any = await doc.data();
      return data;
    }
  }

  async startChat(data: Chat) {
    let conversationObject: any = {};
    conversationObject = Object.assign(conversationObject, data);
    conversationObject.createdOnDate = new Date().getTime();
    conversationObject.users = JSON.stringify(data.users);
    const docRef = await addDoc(
      collection(this.getDb(), FirebaseCollections.chats),
      conversationObject
    );
    var docSnap = await getDoc(
      doc(this.getDb(), FirebaseCollections.chats, docRef.id)
    );
    var chat: any = docSnap.data();
    if (chat  ) {
      if(chat.users){
        chat.users = JSON.parse(chat.users);
      }
      chat.id = docSnap.id;
    }
    return chat;
  }

  async checkChatExists(otherUserId: string) {
    let currentChat: any = null;
    const q = query(
      collection(this.getDb(), FirebaseCollections.chats),
      where('firstUserId', '==', this.storage.User.uid),
      where('secondUserId', '==', otherUserId)
    );
    const data1 = await getDocs(q);
    if (data1.docs.length > 0) {
      currentChat = new Chat();
      let doc: any = data1.docs[0];
      currentChat = await doc.data();
      currentChat.id = doc.id;
    } else {
      const q = query(
        collection(this.getDb(), FirebaseCollections.chats),
        where('firstUserId', '==', otherUserId),
        where('secondUserId', '==', this.storage.User.uid)
      );
      const data2 = await getDocs(q);
      if (data2.docs.length > 0) {
        currentChat = new Chat();
        let doc: any = data2.docs[0];
        currentChat = await doc.data();
        currentChat.id = doc.id;
      }
    }
    if (currentChat) {
      currentChat.users = JSON.parse(currentChat.users);
    }
    return currentChat;
  }

  async sendMessage(data: any, chatId: string) {
    let databaseObject: any = {};
    databaseObject = Object.assign(databaseObject, data);
    let time: any = new Date().getTime();
    databaseObject.id = time;
    const messageCollection = collection(
      this.getDb(),
      `${FirebaseCollections.chats}/${chatId}/${FirebaseCollections.messages}`
    );
    await addDoc(messageCollection, databaseObject);
  }

}
