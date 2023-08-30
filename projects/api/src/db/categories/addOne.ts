import { aql } from 'arangojs';
import { getConnection } from '../core/getConnection';
import { UnauthorizedException } from '@nestjs/common';

export const addOne = async (category: any, userId: string) => {
  if (!userId) {
    throw new UnauthorizedException('Lack of userId');
  }
  const db = getConnection();
  const categoryWithUserId = {
    ...category,
    userId,
  };
  const result = [];

  const results = await db.query(aql`
    INSERT ${categoryWithUserId} INTO Categories RETURN NEW
  `);

  for await (const doc of results) {
    result.push(doc);
  }
  return await result[0];
};
