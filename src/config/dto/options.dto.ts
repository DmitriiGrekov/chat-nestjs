import { IsOptional, IsString } from "class-validator";

export class OptionsDto {

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  filter: string;

  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @IsString()
  take: number;

  @IsOptional()
  @IsString()
  page: number;
}
