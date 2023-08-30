import { Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { getAppData } from 'src/db/data/appData';
@Injectable()
export class SettingsService {
  create(createSettingDto: CreateSettingDto) {
    return 'This action adds a new setting';
  }

  getAppData(userId: string) {
    return getAppData(userId);
  }

  findAll() {
    return `This action returns all settings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} setting`;
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
    return `This action updates a #${id} setting`;
  }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }
}
