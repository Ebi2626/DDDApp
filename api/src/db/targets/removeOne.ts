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
  console.log('Usuwamy item o id: ', id);
  console.log('Dla usera: ', userId);
  const results = await db.query(aql`
  FOR target IN Targets
    FILTER target.userId == ${userId}
    FILTER target._key == ${id}
    REMOVE target IN Targets
    RETURN target._key
  `);
  console.log('all: ', await results.next());
  return { id: await results.next() };
};
