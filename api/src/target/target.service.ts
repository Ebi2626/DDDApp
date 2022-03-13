import { Injectable } from '@nestjs/common';
import { Target } from 'src/interfaces/Target';
import { CreateTargetDto } from './dto/create-target.dto';
import { UpdateTargetDto } from './dto/update-target.dto';

@Injectable()
export class TargetService {
  private targets: CreateTargetDto[] = [];

  create(createTargetDto: CreateTargetDto) {
    this.targets.push(createTargetDto);

    return 'This action adds a new target';
  }

  findAll(): CreateTargetDto[] {
    return this.targets;
  }

  findOne(id: string): CreateTargetDto | string {
    const theTarget = this.targets.find((target) => target.id === id);
    if (theTarget) {
      return theTarget;
    }
    return "There isn't element with such an id: " + id;
  }

  update(id: string, updateTargetDto: UpdateTargetDto) {
    const indexOfUpdatingElement = this.targets.findIndex(
      (target) => target.id === id,
    );

    if (indexOfUpdatingElement !== -1) {
      let tempCopyOfTargets = [...this.targets];
      tempCopyOfTargets[indexOfUpdatingElement] = {
        ...tempCopyOfTargets[indexOfUpdatingElement],
        ...updateTargetDto,
      };

      console.log(tempCopyOfTargets);

      this.targets = tempCopyOfTargets;
      return 'Updated successfully a element with id ' + id;
    }

    return `There isn't element with such an id`;
  }

  remove(id: string) {
    const removingElement = this.targets.find((target) => target.id === id);

    if (removingElement) {
      this.targets = this.targets.filter((target) => target.id !== id);
      return 'Successfully removed element with id ' + id;
    }

    return `There isn't element with such an id`;
  }
}
