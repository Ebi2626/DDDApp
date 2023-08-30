import { aql } from 'arangojs';
import { getConnection } from '../core/getConnection';
import { UnauthorizedException } from '@nestjs/common';

export const getCollection = async (userId: string, collectionName: string) => {
  if (!userId) {
    throw new UnauthorizedException('Lack of userId');
  }
  const db = getConnection();

  const collection = db.collection(collectionName);
  const cursor = await db.query(aql`
    FOR doc IN ${collection}
      FILTER doc.userId == ${userId}
    RETURN doc
  `);
  return cursor.all();
};
