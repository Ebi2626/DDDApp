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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserId } from 'src/decorators/UserId.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @UserId() userId: string) {
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  findAll(
    @UserId() userId: string,
    @Query('categories') categories: string,
    @Query('page') page: string,
    @Query('size') size: string,
  ) {
    if (categories) {
      const categoriesArrray = categories.split(',');
      return this.tasksService.findAll(userId, +page, +size, categoriesArrray);
    }
    return this.tasksService.findAll(userId, +page, +size);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @UserId() userId: string) {
    return this.tasksService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @UserId() userId: string,
  ) {
    return this.tasksService.update(id, updateTaskDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserId() userId: string) {
    return this.tasksService.remove(id, userId);
  }
}
