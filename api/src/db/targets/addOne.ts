import { aql } from 'arangojs';
import { getCollection } from '../core/getCollection';
import { getConnection } from '../core/getConnection';

export const addOne = async (target) => {
  const db = getConnection();
  await getCollection('Targets', db);
  const results = await db.query(aql`
  INSERT ${target} INTO Targets`);
  return 'Dodano item';
};
