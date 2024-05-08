import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from './producer.service';
import { Producer, ProducerRecord } from 'kafkajs';

describe('ProducerService', () => {
  let service: ProducerService;
  let producer: Producer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProducerService],
    }).compile();

    service = module.get<ProducerService>(ProducerService);
    producer = service['producer'];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect producer on module init', async () => {
    const connectSpy = jest.spyOn(producer, 'connect');
    await service.onModuleInit();
    expect(connectSpy).toHaveBeenCalled();
  });

  it('should produce a message', async () => {
    const record: ProducerRecord = {
      topic: 'test',
      messages: [{ value: 'test message' }],
    };
    const sendSpy = jest
      .spyOn(producer, 'send')
      .mockResolvedValueOnce(undefined);
    await service.produce(record);
    expect(sendSpy).toHaveBeenCalledWith(record);
  });

  it('should disconnect producer on application shutdown', async () => {
    const disconnectSpy = jest.spyOn(producer, 'disconnect');
    await service.onApplicationShutdown();
    expect(disconnectSpy).toHaveBeenCalled();
  });
});
