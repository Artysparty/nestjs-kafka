import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
  });
  private readonly producer: Producer;

  constructor() {
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.connectProducer();
  }

  async connectProducer() {
    await this.producer.connect();
  }

  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }

  async onApplicationShutdown() {
    await this.disconnectProducer();
  }

  async disconnectProducer() {
    await this.producer.disconnect();
  }
}
