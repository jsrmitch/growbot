import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from './prisma.service';
import { EventAction, Reason } from '@prisma/client';

@Injectable()
export class SprinklerService {
  constructor(
    @Inject('MQTT_SERVICE') private readonly mqttClient: ClientProxy,
    private readonly prisma: PrismaService,
  ) {}

  async setSprinkler(id: number, state: boolean) {
    if (id < 0 || id > 3) {
      throw new Error('Sprinkler id must be between 0 and 3');
    }
    const topic = `garden/sprinkler/${id}/set`;
    const payload = state ? 'ON' : 'OFF';
    // MQTT emit returns an Observable, we convert it to a promise
    await this.mqttClient.emit(topic, payload).toPromise();

    // Log a manual sprinkler event (ON or OFF)
    await this.prisma.sprinklerEvent.create({
      data: {
        timestamp: new Date(),
        action: state ? EventAction.ON : EventAction.OFF,
        reason: Reason.MANUAL,
        // duration: null, // Optionally set duration if known for ON events
        // scheduleId: null, // Not linked to a schedule for manual
      },
    });

    return { id, state };
  }
}

