import { getAll } from './targets/getAll';
import { getOne } from './targets/getOne';

export const getAllTargets = () => {
  return getAll();
};

export const getTarget = (id) => {
  return getOne(id);
};
