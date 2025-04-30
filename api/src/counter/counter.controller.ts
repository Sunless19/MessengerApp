import { Controller, Get, Req, Res } from '@nestjs/common';
import { CounterService } from './counter.service';
import {Response, Request} from 'express';

@Controller('counter')
export class CounterController 
{
    constructor(private readonly counterService: CounterService) {}

    @Get()
    getCounter(): Promise<number>{
      return this.counterService.getCounter().then((counter) => {
        return counter;
      });
    }

    @Get('session')
    getCounterSession(@Req() req: Request, @Res() res: Response): Response {        
      console.log('Session object:', req.session);

      if (!req.session.counter) {
        req.session.counter = 0;
      }
      req.session.counter += 1;
    
      console.log('Counter value in session:', req.session.counter);
    
      return res.json({ message: `Counter: ${req.session.counter}`, counter: req.session.counter });
    }
}
