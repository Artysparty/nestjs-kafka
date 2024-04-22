import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { WorkoutsConsumer } from './workouts.consumer';
import { WebsocketGateway } from './gateway/gateway';

@Module({
  imports: [KafkaModule],
  controllers: [AppController],
  providers: [AppService, WorkoutsConsumer, WebsocketGateway],
})
export class AppModule {}
