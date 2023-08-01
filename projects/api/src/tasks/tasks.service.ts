import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { addOne } from 'src/db/tasks/addOne';
import { getAll } from 'src/db/tasks/getAll';
import { getMany } from 'src/db/tasks/getMany';
import { getOne } from 'src/db/tasks/getOne';
import { removeOne } from 'src/db/tasks/removeOne';
import { updateOne } from 'src/db/tasks/updateOne';

@Injectable()
export class TasksService {
  async create(createTaskDto: CreateTaskDto, userId: string) {
    return await addOne(createTaskDto, userId);
  }

  async findMany(userId: string, taskIds: string[]) {
    return { tasks: await getMany(userId, taskIds) };
  }

  async findAll(userId: string) {
    return await getAll(userId);
  }

  async findOne(id: string, userId: string) {
    return await getOne(id, userId);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    return await updateOne(id, updateTaskDto, userId);
  }

  async remove(id: string, userId: string) {
    return await removeOne(id, userId);
  }
}
