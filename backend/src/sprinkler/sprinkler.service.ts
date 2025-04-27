import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SprinklerService {
  constructor(@Inject('MQTT_SERVICE') private readonly mqttClient: ClientProxy) {}

  async setSprinkler(id: number, state: boolean) {
    if (id < 0 || id > 3) {
      throw new Error('Sprinkler id must be between 0 and 3');
    }
    const topic = `garden/sprinkler/${id}/set`;
    const payload = state ? 'ON' : 'OFF';
    // MQTT emit returns an Observable, we convert it to a promise
    await this.mqttClient.emit(topic, payload).toPromise();
    return { id, state };
  }
}
