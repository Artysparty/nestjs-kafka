import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { WorkoutsConsumer } from './workouts.consumer';
import { WebsocketGateway } from './gateway/gateway';

@Module({
  imports: [KafkaModule],
  controllers: [],
  providers: [WorkoutsConsumer, WebsocketGateway],
})
export class AppModule {}
