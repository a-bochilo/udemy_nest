import { BackendValidationPipe } from "@app/shared/pipes/backendValidation.pipe";
import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    UseGuards,
    UsePipes,
} from "@nestjs/common";
import { User } from "./decorators/user.decorator";
import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/login.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { AuthGuard } from "./guards/auth.guard";
import { IUserResponse } from "./types/userResponse.interface";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("users")
    @UsePipes(new BackendValidationPipe())
    async createUser(
        @Body("user") createUserDto: CreateUserDto
    ): Promise<IUserResponse> {
        const user = await this.userService.createUser(createUserDto);
        return this.userService.buildUserResponse(user);
    }

    @Post("users/login")
    @UsePipes(new BackendValidationPipe())
    async login(
        @Body("user") loginUserDto: LoginUserDto
    ): Promise<IUserResponse> {
        const user = await this.userService.login(loginUserDto);
        return this.userService.buildUserResponse(user);
    }

    @Get("user")
    @UseGuards(AuthGuard)
    @UsePipes(new BackendValidationPipe())
    async currentUser(@User() user: UserEntity): Promise<IUserResponse> {
        return this.userService.buildUserResponse(user);
    }

    @Put("user")
    @UseGuards(AuthGuard)
    @UsePipes(new BackendValidationPipe())
    async updateUser(
        @User("id") currentUserId: number,
        @Body("user") updateUserDto: UpdateUserDto
    ): Promise<IUserResponse> {
        const user = await this.userService.updateUser(
            currentUserId,
            updateUserDto
        );
        return this.userService.buildUserResponse(user);
    }
}
