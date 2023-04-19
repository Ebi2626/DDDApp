import { Injectable } from '@nestjs/common';
import { CreateTargetDto } from './dto/create-target.dto';
import { UpdateTargetDto } from './dto/update-target.dto';
import { getAll } from 'src/db/targets/getAll';
import { addOne } from 'src/db/targets/addOne';
import { removeOne } from 'src/db/targets/removeOne';

@Injectable()
export class TargetsService {
  async create(createTargetDto: CreateTargetDto, userId: string) {
    const newTarget = await addOne(createTargetDto, userId);
    return { target: newTarget };
  }

  async findAll(userId: string) {
    const targets = await getAll(userId);
    return { targets };
  }

  findOne(id: string) {
    return `This action returns a #${id} target`;
  }

  update(id: string, updateTargetDto: UpdateTargetDto) {
    return `This action updates a #${id} target`;
  }

  async remove(id: string, userId: string) {
    const removedItem = await removeOne(id, userId)
    return removedItem;
  }
}
