import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { DataService } from './data.service';
import { CreateDataDto } from './dto/create-data.dto';
import { UserId } from 'src/decorators/UserId.decorator';
import { Response } from 'express';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post('import')
  import(@UserId() userId: string, @Body() createDataDto: CreateDataDto) {
    return this.dataService.import(userId, createDataDto);
  }

  @Get('export')
  async export(@UserId() userId: string, @Res() res: Response) {
    const data = await this.dataService.export(userId);
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=dddapp-export.json',
    );
    res.setHeader('Content-Type', 'application/json');
    res.json(data);
    return res;
  }
}
