import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerService } from './consumer.service';
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics } from 'kafkajs';

describe('ConsumerService', () => {
  let service: ConsumerService;
  let consumer: Consumer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsumerService],
    }).compile();

    service = module.get<ConsumerService>(ConsumerService);
    consumer = service['kafka'].consumer({ groupId: 'workouts' });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect consumer, subscribe to topic, and run consumer', async () => {
    const connectSpy = jest.spyOn(consumer, 'connect').mockResolvedValueOnce();
    const subscribeSpy = jest
      .spyOn(consumer, 'subscribe')
      .mockResolvedValueOnce();
    const runSpy = jest.spyOn(consumer, 'run').mockResolvedValueOnce();
    const topic: ConsumerSubscribeTopics = { topics: ['workouts'] };
    const config: ConsumerRunConfig = { eachMessage: async () => {} };

    await service.consume(topic, config);

    expect(connectSpy).toHaveBeenCalled();
    expect(subscribeSpy).toHaveBeenCalledWith({ topics: ['workouts'] });
    expect(runSpy).toHaveBeenCalledWith(config);
  });

  it('should disconnect consumer on application shutdown', async () => {
    const disconnectSpy = jest
      .spyOn(consumer, 'disconnect')
      .mockResolvedValueOnce();
    await service.onApplicationShutdown();
    expect(disconnectSpy).toHaveBeenCalled();
  });
});
