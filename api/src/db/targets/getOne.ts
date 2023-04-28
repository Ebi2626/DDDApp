import { aql } from 'arangojs';
import { getConnection } from '../core/getConnection';
import { UnauthorizedException } from '@nestjs/common';

export const getOne = async (id: string, userId: string) => {
  if (!userId) {
    throw new UnauthorizedException('Lack of userId');
  }
  const db = getConnection();
  let result = [];
  const results = await db.query(aql`
  FOR c IN Targets
    FILTER c.userId == ${userId}
    FILTER c._key == ${id}
  RETURN c`);
  for await (let doc of results) {
    result.push(doc);
  }
  return result[0];
};
