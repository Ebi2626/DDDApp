import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, MailService],
})
export class SettingsModule {}
