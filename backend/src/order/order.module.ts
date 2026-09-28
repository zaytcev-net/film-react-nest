import { Module } from '@nestjs/common';
import { FilmsModule } from '../films/films.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [FilmsModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
