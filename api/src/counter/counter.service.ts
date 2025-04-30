import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { FileService } from '../file/file.service';

@Injectable()
export class CounterService 
{
    private counter: number = 0;

    constructor(private readonly fileService: FileService) {}
  
    async getCounter(): Promise<number> {
      this.counter = await this.fileService.readNumberFromFile();
      this.counter = this.counter + 1;
      this.fileService.writeNumberToFile(this.counter);
      return this.counter;
    }   

    async getCounterCookie(response: Response, req: Request): Promise<number> {
        const counterFromCookie = req.cookies['counter'];
        
        console.log('Cookie from request:', counterFromCookie);  
        if (counterFromCookie) {
          this.counter = parseInt(counterFromCookie, 10);
        } else {
          this.counter = 0;
        }
      
        this.counter++;
        console.log('Updated counter value:', this.counter);
      
        response.cookie('counter', String(this.counter), { 
            maxAge: 60 * 60 * 1000,  
            httpOnly: true,  
        });
          
        console.log('Cookie set with value:', this.counter);
      
        return this.counter;
      }
      
}
