import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server, Socket } from 'socket.io';
import { IdentityMessageDto } from './dto/identity-message.dto';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class MessageGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage('createMessage')
  async create(
    @MessageBody('message') message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const identity = await this.messageService.findIdentity(client.id);

    const messages = await this.messageService.create({
      name: identity.name,
      message,
    });

    this.server.emit('messages', messages);

    return messages;
  }

  @SubscribeMessage('identity')
  identity(
    @MessageBody() identityMessageDto: IdentityMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messageService.identity(client.id, identityMessageDto.name);
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const identity = await this.messageService.findIdentity(client.id);
    console.log(identity, isTyping);
    client.broadcast.emit('onTyping', {
      name: identity.name,
      isTyping: isTyping,
    });
  }

  @SubscribeMessage('findAllMessage')
  findAll() {
    return this.messageService.findAll();
  }

  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody() id: number, @ConnectedSocket() client: Socket) {
    return this.messageService.findOne(id);
  }

  @SubscribeMessage('updateMessage')
  update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(updateMessageDto.id, updateMessageDto);
  }

  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: number) {
    return this.messageService.remove(id);
  }
}
