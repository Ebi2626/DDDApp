import { Injectable } from '@nestjs/common';
import { CreateDataDto } from './dto/create-data.dto';
import { collectionsToExport } from './data.model';
import { getCollection } from '../db/data/export';
import { upsertCollection } from '../db/data/import';

@Injectable()
export class DataService {
  async import(userId: string, createDataDto: CreateDataDto): Promise<any> {
    const results = Promise.all(
      collectionsToExport.map((collection) =>
        upsertCollection(userId, collection, createDataDto[collection]),
      ),
    );
    console.log('results: ', await results);
    const resultObject = {};
    (await results).forEach((val: any[], i) => {
      resultObject[collectionsToExport[i]] = val;
    });

    console.log('resultObject: ', resultObject);
    return await resultObject;
  }

  async export(userId: string): Promise<any> {
    const results = Promise.all(
      collectionsToExport.map((collection) =>
        getCollection(userId, collection),
      ),
    );

    const resultObject = {};
    (await results).forEach((val, i) => {
      resultObject[collectionsToExport[i]] = val;
    });
    return resultObject;
  }
}
