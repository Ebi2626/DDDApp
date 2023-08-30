import { Injectable } from '@nestjs/common';
import { CreateTargetDto } from './dto/create-target.dto';
import { UpdateTargetDto } from './dto/update-target.dto';
import { getAll } from 'src/db/targets/getAll';
import { addOne } from 'src/db/targets/addOne';
import { removeOne } from 'src/db/targets/removeOne';
import { getOne } from 'src/db/targets/getOne';
import { updateOne } from 'src/db/targets/updateOne';

@Injectable()
export class TargetsService {
  async create(createTargetDto: CreateTargetDto, userId: string) {
    return { target: await addOne(createTargetDto, userId) };
  }

  async findAll(
    userId: string,
    page: number,
    size: number,
    categories?: string[],
  ) {
    let results;
    if (categories?.length) {
      results = await getAll(userId, page, size, categories);
      return { targets: results.data, page: results.page };
    }
    results = await getAll(userId, page, size);
    return { targets: results.data, page: results.page };
  }

  async findOne(id: string, userId: string) {
    return await getOne(id, userId);
  }

  async update(id: string, updateTargetDto: UpdateTargetDto, userId: string) {
    return await updateOne(id, updateTargetDto, userId);
  }

  async remove(id: string, userId: string) {
    return await removeOne(id, userId);
  }
}
