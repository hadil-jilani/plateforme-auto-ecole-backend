import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '@app/shared/database/db.module';
import { school, SchoolModel } from '@app/shared/Schemas/school.schema';
import { createRabbitMQClient } from '@app/shared/utils/rmq';
import { AuthGuard } from '@app/shared/Guards/auth.guard';

@Module({
  imports: [JwtModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    MongooseModule.forFeature([{ name: SchoolModel.name, schema: school }]),
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    AuthGuard,
    ConfigService,
    {
      provide: 'auth',
      useFactory: (configService: ConfigService) => createRabbitMQClient('auth_queue', configService),
      inject: [ConfigService],
    },
    {
      provide: 'request',
      useFactory: (configService: ConfigService) => createRabbitMQClient('request_queue', configService),
      inject: [ConfigService],
    },
    {
      provide: 'trainer',
      useFactory: (configService: ConfigService) => createRabbitMQClient('trainer_queue', configService),
      inject: [ConfigService],
    },
    {
      provide: 'profile',
      useFactory: (configService: ConfigService) => createRabbitMQClient('profile_queue', configService),
      inject: [ConfigService],
    },
    {
      provide: 'learner',
      useFactory: (configService: ConfigService) => createRabbitMQClient('learner_queue', configService),
      inject: [ConfigService],
    },
    {
      provide: 'occurrence',
      useFactory: (configService: ConfigService) => createRabbitMQClient('occurrence_queue', configService),
      inject: [ConfigService],
    },
    {
      provide: 'agenda',
      useFactory: (configService: ConfigService) => createRabbitMQClient('agenda_queue', configService),
      inject: [ConfigService],
    },
  ],
})
export class AppModule { }
