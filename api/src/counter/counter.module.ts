import { Module } from '@nestjs/common';
import { CounterController } from './counter.controller';
import { CounterService } from './counter.service';
import { FileService } from '../file/file.service';

@Module({
  providers: [CounterService, FileService],
  controllers: [CounterController]
})
export class CounterModule {}
