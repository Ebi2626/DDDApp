require('dotenv').config();
import { Database } from 'arangojs';

export const getConnection = () => {
  // establish database connection
  const config = {
    url: `${process.env.DB_URL}`,
    databaseName: `${process.env.DB_NAME}`,
    auth: {
      username: `${process.env.DB_USERNAME}`,
      password: `${process.env.DB_PASSWORD}`,
    },
  };
  console.log('config: ', config);
  return new Database(config);
};
