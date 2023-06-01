import { UnauthorizedException } from "@nestjs/common";
import { aql } from "arangojs";
import { getConnection } from "../core/getConnection";

export const removeOne = async (fileName: string, userId: string) => {
    if (!userId) {
      throw new UnauthorizedException('Lack of userId');
    }
    const db = getConnection();
    let result = [];
  
    const results = await db.query(aql`
    FOR c in Files
        FILTER c.userId == ${userId}
        FILTER c.fileName == ${fileName}
        REMOVE c IN Files
    RETURN c
    `);
  
    for await (let doc of results) {
      result.push(doc);
    }

    return await result[0];
  };
  