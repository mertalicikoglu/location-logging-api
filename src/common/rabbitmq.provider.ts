import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQProvider implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    await this.connect();
  }

  async connect() {
    try {
      //Connect to RabbitMQ server
      this.connection = await amqp.connect('amqp://guest:guest@rabbitmq:5672');
      this.channel = await this.connection.createChannel();
      console.log('Connected to RabbitMQ successfully');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ', error);
    }
  }

  async sendToQueue(queue: string, message: any) {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not established');
    }
    //Send message to the queue
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  async consume(queue: string, onMessage: (msg: amqp.Message | null) => void) {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not established');
    }
    //Consume messages from the queue
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.consume(queue, onMessage, { noAck: true });
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.close();
      console.log('RabbitMQ connection closed');
    }
  }
}
