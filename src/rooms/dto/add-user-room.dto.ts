import { IsNumber } from "class-validator";

export class AddUserRoomDto {

  @IsNumber()
  userId: number;
}
