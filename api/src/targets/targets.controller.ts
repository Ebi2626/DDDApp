import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { TargetsService } from './targets.service';
import { CreateTargetDto } from './dto/create-target.dto';
import { UpdateTargetDto } from './dto/update-target.dto';
import { UserId } from 'src/decorators/UserId.decorator';

@Controller('targets')
export class TargetsController {
  constructor(private readonly targetsService: TargetsService) { }

  @Post()
  create(@Body() createTargetDto: CreateTargetDto, @UserId() userId: string) {
    return this.targetsService.create(createTargetDto, userId);
  }

  @Get()
  findAll(@UserId() userId: string) {
    return this.targetsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @UserId() userId: string | undefined) {
    console.log(`O zasób z numerem: ${id} pyta użytkownik o id: ${userId}`);
    return this.targetsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTargetDto: UpdateTargetDto) {
    return this.targetsService.update(id, updateTargetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserId() userId: string | undefined) {
    return this.targetsService.remove(id, userId);
  }
}
