import { aql } from 'arangojs';
import { getCollection } from '../core/getCollection';
import { getConnection } from '../core/getConnection';

export const updateOne = async (id, target) => {
  const db = getConnection();
  await getCollection('Targets', db);
  const results = await db.query(aql`UPDATE ${id} WITH ${target} IN Targets`);
  return 'Dodano item';
};
