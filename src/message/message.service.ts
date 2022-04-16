import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  messages: CreateMessageDto[] = [];
  identities: { id: string; name: string }[] = [];
  async create(createMessageDto: CreateMessageDto) {
    this.messages.push(createMessageDto);
    return this.messages;
  }

  async findAll() {
    return this.messages;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }

  async findIdentity(id: string) {
    return this.identities.find((iden) => iden.id === id);
  }

  async identity(id: string, name: string) {
    const person = { id, name };
    this.identities.push(person);
    return person;
  }
}
