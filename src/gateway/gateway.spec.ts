import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketGateway } from './gateway';
import { KafkaModule } from 'src/kafka/kafka.module';
import { WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ProducerService } from '../kafka/producer.service';
import { of } from 'rxjs';

class MockProducerService {
  produce = jest.fn();
}

class MockWebSocketServer {
  private clients: Socket[] = [];

  emit(event: string, ...args: any[]) {
    this.clients.forEach(client => {
      client.emit(event, ...args);
    });
  }

  addClient(client: Socket) {
    this.clients.push(client);
  }

  removeClient(client: Socket) {
    const index = this.clients.indexOf(client);
    if (index !== -1) {
      this.clients.splice(index, 1);
    }
  }
}

describe('WebsocketGateway', () => {
  let gateway: WebsocketGateway;
  let producerService: ProducerService;
  let webSocketServer: MockWebSocketServer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [KafkaModule],
      providers: [
        WebsocketGateway,
        {
          provide: ProducerService,
          useClass: MockProducerService,
        },
        {
          provide: WebSocketServer,
          useClass: MockWebSocketServer,
        }
      ],
    }).compile();

    gateway = module.get<WebsocketGateway>(WebsocketGateway);
    producerService = module.get<ProducerService>(ProducerService);
    webSocketServer = module.get<MockWebSocketServer>(WebSocketServer);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should handle connection', async () => {
    const clientSocket = {} as Socket;
    webSocketServer.addClient(clientSocket);
    gateway.afterInit();
    expect(gateway).toHaveProperty('handleConnection');
  });

  it('should handle disconnection', async () => {
    const clientSocket = {} as Socket;
    webSocketServer.addClient(clientSocket);
    gateway.handleDisconnect(clientSocket);
    expect(gateway).toHaveProperty('handleDisconnect');
  });

  it('should handle message and call produce method', async () => {
    const clientSocket = {} as Socket;
    webSocketServer.addClient(clientSocket);
    const text = 'Test message';
    const produceSpy = jest.spyOn(producerService, 'produce').mockImplementation(() => of(null).toPromise());
    await gateway.handleMessage(clientSocket, text);
    expect(produceSpy).toHaveBeenCalledWith({ topic: 'workouts', messages: [{ value: text }] });
  });
});
