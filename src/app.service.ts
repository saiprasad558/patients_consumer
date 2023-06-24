import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Kafka } from 'kafkajs';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';

@Injectable()
export class AppService {
  private kafka: Kafka;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
  ) {
    this.kafka = new Kafka({
      clientId: configService.get<string>('kafka.clientId'),
      brokers: configService.get<string[]>('kafka.brokers'),
    });
  }

  async ingestData() {
    await Promise.all([this.ingestPatients()]);
    console.log('Data ingestion successful');
  }
  private async ingestPatients() {
    const topicName = 'patients';
    const consumerGroupId = 'data-ingestion-service-patients';

    const consumer = this.kafka.consumer({
      groupId: consumerGroupId,
    });

    await consumer.connect();
    await consumer.subscribe({
      topic: topicName,
      fromBeginning: true,
    });
    await consumer.run({
      eachMessage: async ({ message }) => {
        const [operation, id] = message.key.toString().split('#');
        const value = JSON.parse(message.value.toString());
        const patients = Patient.fromJSON(value);
        if (operation === 'create') {
          await this.patientsRepository.save(patients);
        } else if (operation === 'update') {
          await this.patientsRepository.update(id, patients);
        } else if (operation === 'delete') {
          await this.patientsRepository.delete(id);
        }
      },
    });

    consumer.seek({
      topic: topicName,
      partition: 0,
      offset: '0',
    });
  }
}
