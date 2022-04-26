import { Injectable } from '@nestjs/common';
import { Target } from 'src/interfaces/Target';
import { CreateTargetDto } from './dto/create-target.dto';
import { UpdateTargetDto } from './dto/update-target.dto';
import { getAllTargets } from 'src/db/targets';
import { getOne } from 'src/db/targets/getOne';
import { addOne } from 'src/db/targets/addOne';
import { updateOne } from 'src/db/targets/updateOne';
import { removeOne } from 'src/db/targets/removeOne';

@Injectable()
export class TargetService {
  private targets: CreateTargetDto[] = [];

  async create(createTargetDto: CreateTargetDto) {
    this.targets.push(createTargetDto);
    let adding = await addOne(createTargetDto);
    if (adding) {
      return 'The item has been added';
    }
    return "This action doesn'n works good";
  }

  async findAll(): Promise<any> {
    let result = await getAllTargets();
    if (result) {
      return result;
    }
    return this.targets;
  }

  async findOne(id: string): Promise<string | CreateTargetDto> {
    // const theTarget = this.targets.find((target) => target.id === id);
    // if (theTarget) {
    //   return theTarget;
    // }
    let theTarget = await getOne(id);
    if (theTarget) {
      return theTarget;
    }
    return "There isn't element with such an id: " + id;
  }

  async update(id: string, updateTargetDto: UpdateTargetDto) {
    // const indexOfUpdatingElement = this.targets.findIndex(
    //   (target) => target.id === id,
    // );

    // if (indexOfUpdatingElement !== -1) {
    //   let tempCopyOfTargets = [...this.targets];
    //   tempCopyOfTargets[indexOfUpdatingElement] = {
    //     ...tempCopyOfTargets[indexOfUpdatingElement],
    //     ...updateTargetDto,
    //   };

    //   console.log(tempCopyOfTargets);

    //   this.targets = tempCopyOfTargets;
    const updated = await updateOne(id, updateTargetDto);
    if (updated) {
      return 'Succesfully updated element with id ' + id;
    }
    return `There isn't element with such an id`;
  }

  async remove(id: string) {
    // const removingElement = this.targets.find((target) => target.id === id);

    // if (removingElement) {
    //   this.targets = this.targets.filter((target) => target.id !== id);
    //   return 'Successfully removed element with id ' + id;
    // }

    const removed = await removeOne(id);
    if (removed) {
      return `Element with id: ${id} has been deleted`;
    }

    return `There isn't element with such an id`;
  }
}
