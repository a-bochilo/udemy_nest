import { IsNotEmpty, IsEmail } from "class-validator";

export class UpdateUserDto {
    readonly username: string;
    readonly email: string;
    readonly bio: string;
    readonly image: string;
}
