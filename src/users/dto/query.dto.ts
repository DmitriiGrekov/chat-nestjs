import { IsNumberString, IsOptional, IsString } from "class-validator";

export class QueryDto {

  @IsString()
  @IsOptional()
  search: string;

  @IsNumberString()
  @IsOptional()
  limit: number;
}
