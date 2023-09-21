import { Injectable } from '@nestjs/common';
import { getAppData } from 'src/db/data/appData';
import { getUserSettings, patchUserSettings } from 'src/db/data/userSettings';

import { Settings } from 'dddapp-common';
@Injectable()
export class SettingsService {
  getAppData(userId: string) {
    return getAppData(userId);
  }

  getUserSettings(userId: string) {
    return getUserSettings(userId);
  }

  upsertUserSettings(userId: string, settings: { settings: Settings }) {
    return patchUserSettings(userId, settings);
  }
}
