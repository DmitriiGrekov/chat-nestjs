import { IsPhoneNumber, IsString } from "class-validator";

export class CreateUserDto {

  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  password: string;
}
