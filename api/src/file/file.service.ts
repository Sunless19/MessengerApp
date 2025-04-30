import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  private readonly filePath = path.join((process.cwd(), 'number.txt'));

  constructor() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); 
    }
  }

  writeNumberToFile(number: number): void {
    fs.writeFile(this.filePath, number.toString(), { flag: 'w' }, (err) => {
      if (err) {
        console.error('Error at writing', err);
        throw err;
      }
      console.log(`${number} written in file.`);
    });
  }

  readNumberFromFile(): Promise<number> {
    return new Promise((resolve, reject) => {
      fs.access(this.filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error('No file');
          this.writeNumberToFile(0); 
          resolve(0);
        } else {
          fs.readFile(this.filePath, 'utf-8', (err, data) => {
            if (err) {
              console.error('Error at reading:', err);
              return reject(err);
            }
            const number = parseInt(data, 10);
            resolve(number);
          });
        }
      });
    });
  }
}
