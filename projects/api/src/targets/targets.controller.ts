import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TargetsService } from './targets.service';
import { CreateTargetDto } from './dto/create-target.dto';
import { UpdateTargetDto } from './dto/update-target.dto';
import { UserId } from 'src/decorators/UserId.decorator';

@Controller('targets')
export class TargetsController {
  constructor(private readonly targetsService: TargetsService) {}

  @Post()
  create(@Body() createTargetDto: CreateTargetDto, @UserId() userId: string) {
    return this.targetsService.create(createTargetDto, userId);
  }

  @Get()
  findAll(
    @UserId() userId: string,
    @Query('categories') categories: string,
    @Query('page') page: string,
    @Query('size') size: string,
  ) {
    if (categories && categories.length) {
      const categoriesArrray = categories.split(',');
      return this.targetsService.findAll(
        userId,
        +page,
        +size,
        categoriesArrray,
      );
    }
    return this.targetsService.findAll(userId, +page, +size);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @UserId() userId: string | undefined) {
    return this.targetsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTargetDto: UpdateTargetDto,
    @UserId() userId: string | undefined,
  ) {
    return this.targetsService.update(id, updateTargetDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserId() userId: string | undefined) {
    return this.targetsService.remove(id, userId);
  }
}
