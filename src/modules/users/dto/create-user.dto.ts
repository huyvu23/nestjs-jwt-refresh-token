// DTO (Data Transfer Object).
import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(3, {
    message: 'Title is too short',
  })
  @MaxLength(50, {
    message: 'Title is too long',
  })
  email: string;

  @IsNotEmpty()
  password: string;
}
