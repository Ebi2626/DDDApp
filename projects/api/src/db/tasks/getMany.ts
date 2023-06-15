import { aql } from 'arangojs';
import { getConnection } from '../core/getConnection';
import { UnauthorizedException } from '@nestjs/common';

export const getMany = async (userId: string, taskIds: string[]) => {
  if (!userId) {
    throw new UnauthorizedException('Lack of userId');
  }
  const result = [];
  const db = getConnection();
  const results = await db.query(aql`
  FOR c IN Tasks
    FILTER c.userId == ${userId}
    SEARCH c.id IN ${taskIds}
  RETURN c`);
  for await (let doc of results) {
    result.push(doc);
  }
  return result;
};
