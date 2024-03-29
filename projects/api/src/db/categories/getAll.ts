import { aql } from 'arangojs';
import { getConnection } from '../core/getConnection';
import { UnauthorizedException } from '@nestjs/common';

export const getAll = async (userId: string) => {
  if (!userId) {
    throw new UnauthorizedException('Lack of userId');
  }
  const result = [];
  const db = getConnection();
  const results = await db.query(aql`
  FOR c IN Categories
    FILTER c.userId == ${userId} || c.isDefault == true
  RETURN c`);
  for await (const doc of results) {
    result.push(doc);
  }
  return result;
};
