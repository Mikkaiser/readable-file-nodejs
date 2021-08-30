import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import readline from 'readline';

const multerConfig = multer();
export const router = Router();

interface People {
  name: string;
  age: number;
  clothesColor: string;
}

router.post('/people', multerConfig.single('file'), async (request: Request, response: Response) => {
  const buffer  = request.file?.buffer;
  const readableFile = new Readable();
  
  readableFile.push(buffer);
  readableFile.push(null);
  
  const peopleLine = readline.createInterface({
    input: readableFile
  });

  const peopleArr: People[] = [];

  for await(let line of peopleLine) {
    const peopleLineSplit = line.split(',');
    peopleArr.push({
      name: peopleLineSplit[0],
      age: Number(peopleLineSplit[1]),
      clothesColor: peopleLineSplit[2]
    });
  }

  return response.json(peopleArr);
});