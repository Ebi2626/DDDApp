import { aql } from 'arangojs';
import { getConnection } from '../core/getConnection';
import { UnauthorizedException } from '@nestjs/common';
import { Category, Target, Task } from 'dddapp-common';
import { DocumentCollection } from 'arangojs/collection';

export const upsertCollection = async (
  userId: string,
  collectionName: string,
  collectionData: Target[] | Task[] | Category[],
) => {
  if (!userId) {
    throw new UnauthorizedException('Lack of userId');
  }
  const db = getConnection();

  const collection = db.collection(collectionName) as DocumentCollection;
  const result = [];

  for (const data of collectionData) {
    const dataWithUpdatedUserId = {
      ...data,
      userId,
    };
    if (dataWithUpdatedUserId.id) {
      const cursor = await db.query(aql`
      UPSERT { _key: ${data.id}, userId: ${userId} }
        INSERT (${dataWithUpdatedUserId})
        UPDATE (${dataWithUpdatedUserId}) IN ${collection}
      OPTIONS { keepNull: false }
      RETURN NEW
    `);

      const updatedDocument = await cursor.all();
      result.push(updatedDocument[0]);
    }
  }

  return result;
};
