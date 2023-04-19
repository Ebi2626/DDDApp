import { aql } from 'arangojs';
import { getConnection } from '../core/getConnection';
import { UnauthorizedException } from '@nestjs/common';

export const addOne = async (target: any, userId: string) => {
  if (!userId) {
    throw new UnauthorizedException('Lack of userId');
  }
  const db = getConnection();
  const targetWithUserId = {
    ...target,
    userId,
  }
  const results = await db.query(aql`
  INSERT ${targetWithUserId} INTO Targets`);
  return targetWithUserId;
};
