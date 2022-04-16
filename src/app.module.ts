import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MessageModule } from './message/message.module';

@Module({
  imports: [MessageModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
