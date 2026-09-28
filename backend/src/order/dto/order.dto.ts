import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class TicketDto {
  @IsUUID()
  film: string;

  @IsUUID()
  session: string;

  @IsNotEmpty()
  daytime: string;

  @IsInt()
  @Min(1)
  row: number;

  @IsInt()
  @Min(1)
  seat: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}
