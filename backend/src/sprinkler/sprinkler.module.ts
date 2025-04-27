import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SprinklerService } from './sprinkler.service';
import { SprinklerController } from './sprinkler.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MQTT_SERVICE',
        transport: Transport.MQTT,
        options: {
          url: 'mqtt://192.168.1.108:1883', // Change as needed
        },
      },
    ]),
  ],
  controllers: [SprinklerController],
  providers: [SprinklerService],
})
export class SprinklerModule {}
