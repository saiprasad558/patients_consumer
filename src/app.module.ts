import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import configuration from './config/configuration';
import { Patient } from './entities/patient.entity';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('pg.host'),
          port: configService.get<number>('pg.port'),
          username: configService.get<string>('pg.user'),
          password: configService.get<string>('pg.password'),
          database: configService.get<string>('pg.database'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Patient]),
    ClientsModule.registerAsync([
      {
        name: 'PATIENTS_CONSUMER',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: configService.get<string>('kafka.clientId'),
                brokers: configService.get<string[]>('kafka.brokers'),
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
