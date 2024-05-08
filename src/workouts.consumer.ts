import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './kafka/consumer.service';

@Injectable()
export class WorkoutsConsumer implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService) {}
  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['workouts'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
        },
      },
    );
  }
}
