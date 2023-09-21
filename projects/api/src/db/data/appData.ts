import { aql } from 'arangojs';
import { getConnection } from '../core/getConnection';
import { UnauthorizedException } from '@nestjs/common';

export const getAppData = async (userId: string) => {
  if (!userId) {
    throw new UnauthorizedException('Lack of userId');
  }
  const result = [];
  const db = getConnection();
  const results = await db.query(aql`
    LET categories = (
      FOR c IN Categories
        FILTER c.userId == ${userId} || c.isDefault == true
        COLLECT WITH COUNT INTO length
      RETURN length
      )
    LET targets = (
      FOR c IN Targets
        FILTER c.userId == ${userId}
        COLLECT WITH COUNT INTO length
      RETURN length
    )
    LET tasks = (
      FOR c IN Tasks
        FILTER c.userId == ${userId}
        COLLECT WITH COUNT INTO length
      RETURN length
    )
    RETURN {
      "categories": FIRST(categories),
      "targets": FIRST(targets),
      "tasks": FIRST(tasks)
    }
  `);
  for await (const doc of results) {
    result.push(doc);
  }
  return result[0];
};
