import { aql } from 'arangojs';
import { getCollection } from '../core/getCollection';
import { getConnection } from '../core/getConnection';
import { UnauthorizedException } from '@nestjs/common';

export const removeOne = async (id: string, userId: string) => {
  if (!userId) {
    throw new UnauthorizedException('Lack of userId');
  }
  const db = getConnection();
  await getCollection('Targets', db);
  let result = [];
  const results = await db.query(aql`
  FOR c IN Targets
    FILTER c.userId == ${userId}
    FILTER c._key == ${id}
    REMOVE c IN Targets
  RETURN c
  `);
  for await (let doc of results) {
    result.push(doc);
  }
  return { id: id };
};
