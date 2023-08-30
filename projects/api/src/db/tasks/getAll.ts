import { aql } from 'arangojs';
import { getConnection } from '../core/getConnection';
import { UnauthorizedException } from '@nestjs/common';

export const getAll = async (
  userId: string,
  page: number,
  size: number,
  categories?: string[],
) => {
  if (!userId) {
    throw new UnauthorizedException('Lack of userId');
  }
  const result = [];
  const db = getConnection();
  let results;
  let length;
  const lenghtArr = [];
  if (categories && categories.length) {
    results = await db.query(aql`
  FOR c IN Tasks
    FILTER c.userId == ${userId}
    FILTER ${categories} ANY IN c.categories
    LIMIT ${page * size}, ${size}
  RETURN c`);
    length = await db.query(aql`
  FOR c IN Tasks
    FILTER c.userId == ${userId}
    FILTER ${categories} ANY IN c.categories
    COLLECT WITH COUNT INTO length
    RETURN length
  `);
  } else {
    results = await db.query(aql`
  FOR c IN Tasks
    FILTER c.userId == ${userId}
    LIMIT ${page * size}, ${size}
  RETURN c`);
    length = await db.query(aql`
  FOR c IN Tasks
    FILTER c.userId == ${userId}
    COLLECT WITH COUNT INTO length
    RETURN length
  `);
  }
  for await (const doc of results) {
    result.push(doc);
  }
  for await (const doc of length) {
    lenghtArr.push(doc);
  }
  const totalPages = Math.ceil(lenghtArr[0] / size);
  const resultPage = {
    current: page < totalPages ? page : totalPages,
    size,
    totalItems: lenghtArr[0],
    totalPages,
  };
  return {
    data: result,
    page: resultPage,
  };
};
