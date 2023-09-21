import { Controller, Get, Body, Patch } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UserId } from 'src/decorators/UserId.decorator';
import { Settings } from 'dddapp-common';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('userSettings')
  getUserSettings(@UserId() userId: string) {
    return this.settingsService.getUserSettings(userId);
  }

  @Patch('userSettings')
  upsert(@UserId() userId: string, @Body() settings: { settings: Settings }) {
    return this.settingsService.upsertUserSettings(userId, settings);
  }

  @Get('appData')
  getAppData(@UserId() userId: string) {
    return this.settingsService.getAppData(userId);
  }
}
