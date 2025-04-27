import { Controller, Post, Param, ParseIntPipe } from '@nestjs/common';
import { SprinklerService } from './sprinkler.service';

@Controller('sprinkler')
export class SprinklerController {
  constructor(private readonly sprinklerService: SprinklerService) {}

  @Post(':id/on')
  turnOn(@Param('id', ParseIntPipe) id: number) {
    console.log(`Sprinkler ${id} ON endpoint hit`);
    return this.sprinklerService.setSprinkler(id, true);
  }

  @Post(':id/off')
  turnOff(@Param('id', ParseIntPipe) id: number) {
    console.log(`Sprinkler ${id} OFF endpoint hit`);
    return this.sprinklerService.setSprinkler(id, false);
  }
}
