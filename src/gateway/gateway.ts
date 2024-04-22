import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ProducerService } from 'src/kafka/producer.service';

@WebSocketGateway()
export class WebsocketGateway {
  constructor(private readonly producerService: ProducerService) {}

  @WebSocketServer()
  server;

  @SubscribeMessage('workouts')
  async handleEvent(@MessageBody() data: any) {
    console.log('emitted ', data);
    this.server.emit('workouts', data);
    await this.producerService.produce({
      topic: 'workouts',
      messages: [
        {
          value: data,
        },
      ],
    });
    return data;
  }
}
