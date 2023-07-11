import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { getAll } from 'src/db/categories/getAll';
import { addOne } from 'src/db/categories/addOne';
import { removeOne } from 'src/db/categories/removeOne';
import { getOne } from 'src/db/categories/getOne';
import { updateOne } from 'src/db/categories/updateOne';

@Injectable()
export class CategoriesService {
  async create(createCategoryDto: CreateCategoryDto, userId: string) {
    return { category: await addOne(createCategoryDto, userId) };
  }

  async findAll(userId: string) {
    return { categories: await getAll(userId) };
  }

  async findOne(id: string, userId: string) {
    return await getOne(id, userId);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ) {
    return await updateOne(id, updateCategoryDto, userId);
  }

  async remove(id: string, userId: string) {
    return await removeOne(id, userId);
  }
}
