import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
// @ts-ignore
import SockJS from 'sockjs-client/dist/sockjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private client: Client;
  private messageSubject: Subject<any> = new Subject();
  private subscriptions: Map<string, StompSubscription> = new Map();
  private pendingTopics: Set<string> = new Set();
  private currentTopics: Set<string> = new Set();
  private connected: boolean = false;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => {
        const token = sessionStorage.getItem('authToken');
        return new SockJS(`http://localhost:8080/ws?access_token=${token}`);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        this.connected = true;
        this.subscriptions.clear();
        this.currentTopics.forEach(topic => this.subscribeToTopic(topic));
        this.pendingTopics.forEach(topic => this.subscribeToTopic(topic));
        this.pendingTopics.clear();
      },
      onStompError: frame => {
        console.error('Broker error: ' + frame.headers['message']);
        console.error('Details: ' + frame.body);
      },
      onDisconnect: () => {
        this.connected = false;
        this.subscriptions.clear();
      }
    });
    this.client.activate();
  }

  private subscribeToTopic(topic: string): void {
    if (!this.subscriptions.has(topic)) {
      const subscription = this.client.subscribe(topic, (message: IMessage) => {
        try {
          const parsed = JSON.parse(message.body);
          this.messageSubject.next(parsed);
        } catch (e) {
          console.error('Error parsing message from topic', topic, e);
        }
      });
      this.subscriptions.set(topic, subscription);
    }
    this.currentTopics.add(topic);
  }

  subscribeToSolicitudes(userId: number): void {
    const topic = `/topic/solicitudes/${userId}`;
    if (!this.connected) {
      this.pendingTopics.add(topic);
    } else {
      this.subscribeToTopic(topic);
    }
  }

  subscribeToNotificaciones(userId: number): void {
    const topic = `/topic/notificaciones/${userId}`;
    if (!this.connected) {
      this.pendingTopics.add(topic);
    } else {
      this.subscribeToTopic(topic);
    }
  }

  subscribeToConversation(emisorId: number | undefined, receptorId: number): void {
    const topic1 = `/topic/conversacion/${emisorId}-${receptorId}`;
    const topic2 = `/topic/conversacion/${receptorId}-${emisorId}`;
    if (!this.connected) {
      this.pendingTopics.add(topic1);
      this.pendingTopics.add(topic2);
    } else {
      this.subscribeToTopic(topic1);
      this.subscribeToTopic(topic2);
    }
  }

  listenEvent(): Observable<any> {
    return this.messageSubject.asObservable();
  }
}
