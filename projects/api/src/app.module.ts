import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/Logging.interceptor';
import { AuthGuard, KeycloakConnectModule, PolicyEnforcementMode, TokenValidation } from 'nest-keycloak-connect';
import { TargetsModule } from './targets/targets.module';
import { JwtModule } from '@nestjs/jwt';
import { TasksModule } from './tasks/tasks.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


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
      secret: '7GDJOtCcL1KgcRKmVHj1OvO59KSGWZTs',
      policyEnforcement: PolicyEnforcementMode.ENFORCING, // optional
      tokenValidation: TokenValidation.OFFLINE, // optional
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    TargetsModule,
    TasksModule,
    FilesModule,
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
  ],
})
export class AppModule { }
