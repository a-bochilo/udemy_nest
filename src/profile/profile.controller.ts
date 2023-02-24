import { User } from "@app/user/decorators/user.decorator";
import { AuthGuard } from "@app/user/guards/auth.guard";
import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
} from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { IProfileResponse } from "./types/profileResponse.interfase";

@Controller("profiles")
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get(":username")
    async getProfile(
        @User("id") userId: number,
        @Param("username") profileUsername: string
    ): Promise<IProfileResponse> {
        const profile = await this.profileService.getProfile(
            userId,
            profileUsername
        );
        return this.profileService.buildProfileResponse(profile);
    }

    @Post(":username/follow")
    @UseGuards(AuthGuard)
    async followProfile(
        @User("id") userId: number,
        @Param("username") profileUsername: string
    ): Promise<IProfileResponse> {
        const profile = await this.profileService.followProfile(
            userId,
            profileUsername
        );
        return this.profileService.buildProfileResponse(profile);
    }

    @Delete(":username/follow")
    @UseGuards(AuthGuard)
    async unfollowProfile(
        @User("id") userId: number,
        @Param("username") profileUsername: string
    ): Promise<IProfileResponse> {
        const profile = await this.profileService.unfollowProfile(
            userId,
            profileUsername
        );
        return this.profileService.buildProfileResponse(profile);
    }
}
