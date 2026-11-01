import { Type } from 'class-transformer';
import { IsInt, IsMongoId, Min } from 'class-validator';

export class ActiveSessionQueryDto {
  @IsMongoId()
  restaurantId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  table!: number;
}
