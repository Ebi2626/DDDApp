import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/Logging.interceptor';
import {
  AuthGuard,
  KeycloakConnectModule,
  PolicyEnforcementMode,
  TokenValidation,
} from 'nest-keycloak-connect';
import { TargetsModule } from './targets/targets.module';
import { JwtModule } from '@nestjs/jwt';
import { TasksModule } from './tasks/tasks.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoriesModule } from './categories/categories.module';
import { DataModule } from './data/data.module';
import { SettingsModule } from './settings/settings.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MailService } from './mail/mail.service';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationService } from './notification/notification/notification.service';
import { UserInfoService } from './user-info/user-info.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    JwtModule.register({ secret: '7GDJOtCcL1KgcRKmVHj1OvO59KSGWZTs' }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KeycloakConnectModule.register({
      authServerUrl: 'http://localhost:8080/auth', // might be http://localhost:8080/auth for older keycloak versions
      realm: 'dddapp',
      clientId: 'dddapp_server',
      secret: 'SDUHKxQbawPshf84bJLEV1dr5S4T2c1W',
      policyEnforcement: PolicyEnforcementMode.ENFORCING, // optional
      tokenValidation: TokenValidation.OFFLINE, // optional
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    MailerModule.forRoot({
      transport: {
        host: 'localhost',
        port: 1025,
        ignoreTLS: true,
        secure: false,
      },
      preview: true,
      defaults: {
        from: '"Nawigator Sukcesu" <app@nawigator-sukcesu.pl>',
      },
      template: {
        dir: process.cwd() + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    HttpModule,
    ScheduleModule.forRoot(),
    TargetsModule,
    TasksModule,
    FilesModule,
    CategoriesModule,
    DataModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    MailService,
    NotificationService,
    UserInfoService,
  ],
})
export class AppModule {}
