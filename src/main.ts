import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA],
        },
      },
    },
  );
  const appService = app.get(AppService);
  await appService.ingestData();
  await app.listen();
  console.log('Microservice is listening');
}
bootstrap().catch((err) => console.error(err));
