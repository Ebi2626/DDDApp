import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TargetModule } from './target/target.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TargetModule,
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
// api/target :: Target<Array>
// api/target/{id} :: Target
// api/target/{id}/task :: Task<Array>
// api/target/{id}/task/{id} :: Task
// api/target/{id}/reward :: Reward<Array>
// api/target/{id}/reward/{id} :: Reward
// api/target/{id}/punishment :: Punishment<Array>
// api/target/{id}/punishment/{id} :: Punishment
