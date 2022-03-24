import { Controller, Get } from '@nestjs/common';

@Controller('pokemon')
export class PokemonController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
