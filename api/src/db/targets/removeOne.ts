import { aql } from 'arangojs';
import { getCollection } from '../core/getCollection';
import { getConnection } from '../core/getConnection';

export const removeOne = async (id) => {
  const db = getConnection();
  await getCollection('Targets', db);
  const results = await db.query(aql`REMOVE ${id} IN Targets`);
  return 'Usunięto item';
};
