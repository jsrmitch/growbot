import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SprinklerModule } from './sprinkler/sprinkler.module';

@Module({
  imports: [SprinklerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
