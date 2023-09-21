import { aql } from 'arangojs';
import { getConnection } from '../core/getConnection';
import { UnauthorizedException } from '@nestjs/common';

export const getOne = async (id: string, userId: string) => {
  if (!userId) {
    throw new UnauthorizedException('Lack of userId');
  }
  const db = getConnection();
  const result = [];
  const results = await db.query(aql`
  FOR c IN Tasks
    FILTER c.userId == ${userId}
    FILTER c._key == ${id}
  RETURN c`);
  for await (const doc of results) {
    result.push(doc);
  }
  return result[0];
};
