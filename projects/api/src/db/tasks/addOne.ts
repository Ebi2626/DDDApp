import { aql } from 'arangojs';
import { getConnection } from '../core/getConnection';
import { UnauthorizedException } from '@nestjs/common';

export const addOne = async (task: any, userId: string) => {
  if (!userId) {
    throw new UnauthorizedException('Lack of userId');
  }
  const db = getConnection();
  const taskWithUserId = {
    ...task,
    userId,
  }
  let result = [];

  const results = await db.query(aql`
  INSERT ${taskWithUserId} INTO Tasks RETURN NEW`);

  for await (let doc of results) {
    result.push(doc);
  }
  return await result[0];
};
