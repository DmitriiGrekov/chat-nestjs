import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserDto {

  @IsString()
  phone: string;

  @IsString()
  password: string;

  @IsString()
  login: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  firstname: string;

  @IsString()
  @IsOptional()
  lastname: string;

  @IsString()
  @IsOptional()
  patroname: string;
}
