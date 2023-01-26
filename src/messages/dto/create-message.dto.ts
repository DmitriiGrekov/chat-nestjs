import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateMessageDto {
  @IsInt()
  room_id: number;

  @IsString()
  @IsOptional()
  message: string;
}
