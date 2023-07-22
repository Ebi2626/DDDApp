import { aql } from 'arangojs';
import { getCollection } from '../core/getCollection';
import { getConnection } from '../core/getConnection';
import { UnauthorizedException } from '@nestjs/common';

export const updateOne = async (id: string, category, userId: string) => {
  if (!userId) {
    throw new UnauthorizedException('Lack of userId');
  }
  const db = getConnection();
  await getCollection('Categories', db);
  const result = [];
  const results = await db.query(aql`
  FOR c IN Categories
    FILTER c.userId == ${userId}
    UPDATE ${id} WITH ${category} IN Categories RETURN NEW`);
  for await (const doc of results) {
    result.push(doc);
  }
  return { category: await result[0] };
};
