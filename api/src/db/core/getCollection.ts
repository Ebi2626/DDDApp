import { Database } from 'arangojs';

// function to get collection or create it if it doesn't exist
export const getCollection = async (collectionName: string, db: Database) => {
  // get list of collections in database
  const collections = await db.collections();

  // check if collection exists, if so return collection, if not, create it
  if (collections.find((c) => c.name === collectionName)) {
    return await db.collection(collectionName);
  } else {
    return db.createCollection(collectionName);
  }
};
