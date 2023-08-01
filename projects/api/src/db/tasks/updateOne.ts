import { aql } from 'arangojs';
import { getCollection } from '../core/getCollection';
import { getConnection } from '../core/getConnection';
import { UnauthorizedException } from '@nestjs/common';

export const updateOne = async (id: string, task, userId: string) => {
  if (!userId) {
    throw new UnauthorizedException('Lack of userId');
  }
  const db = getConnection();
  await getCollection('Tasks', db);
  const result = [];
  const results = await db.query(aql`
  FOR c IN Tasks
    FILTER c.userId == ${userId}
    UPDATE ${id} WITH ${task} IN Tasks RETURN NEW`);
  for await (const doc of results) {
    result.push(doc);
  }
  return { task: await result[0] };
};
