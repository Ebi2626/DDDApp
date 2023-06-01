import { UnauthorizedException } from "@nestjs/common";
import { aql } from "arangojs";
import { getConnection } from "../core/getConnection";

export const addOne = async (saveFileDto: any, userId: string) => {
    if (!userId) {
      throw new UnauthorizedException('Lack of userId');
    }
    const db = getConnection();
    const fileWithUserId = {
      ...saveFileDto,
      userId,
    }
    let result = [];
  
    const results = await db.query(aql`
    INSERT ${fileWithUserId} INTO Files RETURN NEW`);
  
    for await (let doc of results) {
      result.push(doc);
    }

    return await result[0];
  };
  