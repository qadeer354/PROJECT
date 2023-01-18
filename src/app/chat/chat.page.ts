import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { User } from 'firebase/auth';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
} from 'firebase/firestore';
import { FirebaseCollections } from '../helpers/enum';
import { Chat } from '../models/chat.model';
import { GeneralizedUser } from '../models/generalized.user.model';
import { Message } from '../models/message.model';
import { FirebaseService } from '../services/firebase.service';
import { RoutingService } from '../services/routing.service';
import { StorageService } from '../services/storage.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {
  currentUser?: User;
  messageText: string = '';
  otherUser?: User;
  currentChat: Chat | undefined;
  unsubscribe: any;
  messages: Message[] = [];
  @ViewChild(IonContent, { static: true }) content?: IonContent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebase: FirebaseService,
    private storage: StorageService,
    public util: UtilService,
    private routing: RoutingService
  ) {}

  async ngOnInit() {
    this.currentUser = this.storage.User;
    var uid = this.activatedRoute.snapshot.paramMap.get('uid');
    this.otherUser = await this.firebase.getUserByUID(uid!)!;
    this.initializeChat();
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  async initializeChat() {
    this.currentChat = await this.firebase.checkChatExists(
      this.otherUser?.uid!
    );
    if (!this.currentChat) {
      var chat = new Chat();
      chat.firstUserId = this.currentUser!.uid;
      chat.secondUserId = this.otherUser!.uid;
      chat.users = [
        new GeneralizedUser(
          this.currentUser?.uid!,
          this.currentUser?.displayName!,
          this.currentUser?.photoURL!
        ),
        new GeneralizedUser(
          this.otherUser?.uid!,
          this.otherUser?.displayName!,
          this.otherUser?.photoURL!
        ),
      ];
      this.currentChat = await this.firebase.startChat(chat);
    }
    this.listenMessages();
  }

  async sendMessage() {
    if(this.messageText.length){
      var message: Message = new Message();
      message.userId = this.currentUser!.uid!;
      message.userName = this.currentUser!.displayName!;
      message.text = this.messageText;
      await this.firebase.sendMessage(message, this.currentChat?.id!);
      this.messageText = '';
    }
  }

  async listenMessages() {
    const q = query(
      collection(
        this.firebase.getDb(),
        `${FirebaseCollections.chats}/${this.currentChat?.id}/${FirebaseCollections.messages}`
      ),
      orderBy('id', 'asc')
    );
    this.unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      for (let item of querySnapshot.docs) {
        let data = item.data();
        let msg = new Message();
        msg = Object.assign(msg, data);
        let index = this.messages.findIndex((x) => x.id == msg.id);
        if (index == -1) {
          this.messages.push(msg);
          this.updateScroll();
        }
      }
    });
  }

  updateScroll() {
    setTimeout(() => {
      this.content!.scrollToBottom();
    }, 500);
  }

  goBack() {
    this.routing.goBack();
  }
}
