import { Logger } from '@nestjs/common';
import {} from '@nestjs/platform-socket.io';
import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { BehaviorSubject, Subject } from 'rxjs';
import { Server, Socket } from 'socket.io';

interface ClientMessage {
  event: 'move' | 'up';
  imageName: string;
  translateState: TranslateState;
}

interface TranslateState {
  translateX: number;
  translateY: number;
}

@WebSocketGateway(3001, { path: '/dde' })
export class EventsGateway implements OnGatewayInit, OnGatewayConnection {
  private logger: Logger = new Logger('EventsGateway');
  private clientEventAction = new Subject<ClientMessage>();
  private allClientState = new BehaviorSubject<ClientMessage[]>([]);

  @WebSocketServer() wss: Server;

  constructor() {}
  handleConnection(client: Socket, ...args: any[]) {
    client.emit('msgToInitClient', this.allClientState.getValue());
  }

  afterInit(server: any) {
    this.clientEventAction.subscribe((client) => {
      const currentState = this.allClientState.getValue();
      const index = currentState.findIndex(
        (c) => c.imageName === client.imageName,
      );
      if (index > -1) {
        currentState[index] = client;
      } else {
        currentState.push(client);
      }
      this.allClientState.next([...currentState]);
    });

    this.allClientState.subscribe((state) => {
      this.wss.emit('msgToClient', state);
    });
  }
  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, clientMessage: ClientMessage) {
    this.clientEventAction.next(clientMessage);
  }
}
