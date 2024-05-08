import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { ProducerService } from 'src/kafka/producer.service';

@WebSocketGateway(3001, { cors: true })
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('WebsocketGateway');

  constructor(private readonly producerService: ProducerService) {}

  @WebSocketServer() server: Server;

  afterInit() {
    this.logger.log('WebsocketGateway Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`New client connected: ${client.id}`);
    client.emit('connected', 'Successfully connected to the server.');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('workouts')
  async handleMessage(
    client: Socket,
    text: string,
  ): Promise<WsResponse<string>> {
    this.logger.log(`Received new event`);
    await this.producerService.produce({
      topic: 'workouts',
      messages: [{ value: text }],
    });
    return { event: 'workouts', data: text };
  }
}
