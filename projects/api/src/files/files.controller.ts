import { Controller, Post, UseInterceptors, UploadedFile, Body, Param, Delete, Query } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express"; 
import { diskStorage } from "multer";
import { inspect } from "util";
import { v4 } from 'uuid';
import * as fs from 'fs';
import * as path from "path";
import { UserId } from "src/decorators/UserId.decorator";
import { FilesService } from "./files.service";

@Controller('files')
export class FilesController {
    private static tempFileName?: string;

    constructor(private readonly filesService: FilesService) {}

    @Delete(':taskId')
    async deleteFile(@Param('taskId') taskId: string, @Query('fileName') fileName: string, @UserId() userId: string) {
      const filePath  = `./uploads/${userId}/${taskId}/${fileName}`;
      return await this.filesService.deleteFile(filePath, fileName, userId);
    }

    @Post(':taskId')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req: any, file, cb) => {
              const userId = req?.user?.sub;
              const taskId = req?.params?.taskId;
              if(!userId || !taskId) {
                throw new Error(`userId (${userId}) and taskId (${taskId}) are required`);
              }

              const directory = `./uploads/${userId}/${taskId}`;

              if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory, { recursive: true })
              }
        
              cb(null, directory)
            },
            filename: (req: any, file, cb) => {
              const fileName = `${v4()}${path.extname(file.originalname)}`;  
              FilesController.tempFileName = fileName;
              cb(null, fileName);
            }
          }),
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body, @Param('taskId') taskId: string, @UserId() userId: string) {
      const taskCompletionIndex = body?.taskCompletionIndex;  
      const savedFile = {
          fileName: FilesController.tempFileName,
          originalName: file.originalname,
          size: file.size,
          taskId,
          userId,
          ...(taskCompletionIndex ?? {}),
        }
        return await this.filesService.saveFile(savedFile, userId);
    }
    
}