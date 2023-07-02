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
        const patient = Patient.fromJSON(value);
        const data: Record<string, Patient> = {};
        if (operation === 'create') {
          data[id] = patient;
        } else if (operation === 'update') {
          data[id] = {
            ...data[id],
            ...patient,
          };
        } else if (operation === 'delete') {
          delete data[id];
        }

        await this.patientsRepository.save(Object.values(data));
      },
    });

    consumer.seek({
      topic: topicName,
      partition: 0,
      offset: '0',
    });
  }
}
