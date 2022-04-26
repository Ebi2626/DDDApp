import { aql } from 'arangojs';
import { getCollection } from '../core/getCollection';
import { getConnection } from '../core/getConnection';

export const getAll = async () => {
  const db = getConnection();
  const collection = await getCollection('Targets', db);
  let result = [];
  const results = await db.query(aql`
  FOR c IN Targets
  RETURN c`);
  for await (let doc of results) {
    result.push(doc);
  }
  console.log(result);
  return result;
};
