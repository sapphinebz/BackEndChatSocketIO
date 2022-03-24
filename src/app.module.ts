import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [EventsModule, PokemonModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
