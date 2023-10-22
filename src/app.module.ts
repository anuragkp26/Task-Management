import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        //return {
        type: 'postgres',
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        autoLoadEntities: true,
        synchronize: true,
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        // };
      }),
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   // host: 'localhost',
    //   // port: 5432,
    //   // username: '',
    //   // password: '',
    //   // database: 'task-management',
    //   entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
