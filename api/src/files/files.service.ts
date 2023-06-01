import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SaveFileDto } from "./dto/save-file.dto";
import { addOne } from "src/db/files/addOne";
import { removeOne } from "src/db/files/removeOne";

import * as fs from 'fs';


@Injectable()
export class FilesService {

    async deleteFile(filePath: string, fileName: string, userId: string) {
        if (!userId) {
            throw new UnauthorizedException('Lack of userId');
          }
      fs.unlinkSync(filePath);
      return await removeOne(fileName, userId);

    }

    async saveFile(saveFileDto: SaveFileDto, userId: string) {
        return await addOne(saveFileDto, userId);
    }

}