import { aql } from 'arangojs';
import { getCollection } from '../core/getCollection';
import { getConnection } from '../core/getConnection';

export const getAll = async (collectionName) => {
  // make connection
  const db = getConnection();
  // make sure cat collection exists
  await getCollection(collectionName, db);
  // declare array to hold cats
  let result = [];
  // query for cats
  const results = await db.query(aql`FOR c IN ${collectionName} RETURN c`);
  // loop through array cursor and push results in array
  for await (let doc of results) {
    result.push(doc);
  }
  // log results
  console.log(result);
  // return the list of cats
  return result;
};
