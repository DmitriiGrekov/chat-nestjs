import { IsPhoneNumber, IsString } from "class-validator";

export class AuthLoginDto {

  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  password: string;
}
