import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ProfileType } from "@app/profile/types/profile.type";
import { IProfileResponse } from "./types/profileResponse.interfase";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@app/user/user.entity";
import { Repository } from "typeorm";
import { FollowEntity } from "./follow.entity";

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @InjectRepository(FollowEntity)
        private readonly followRepository: Repository<FollowEntity>
    ) {}

    async getProfile(
        userId: number,
        profileUsername: string
    ): Promise<ProfileType> {
        const user = await this.userRepository.findOne({
            where: { username: profileUsername },
        });

        if (!user) {
            throw new HttpException(
                "Profile does not exist",
                HttpStatus.NOT_FOUND
            );
        }

        if (!userId) return { ...user, following: false };

        const follow = await this.followRepository.findOne({
            where: { followerId: userId, folllowingId: user.id },
        });

        return { ...user, following: Boolean(follow) };
    }

    async followProfile(
        userId: number,
        profileUsername: string
    ): Promise<ProfileType> {
        const user = await this.userRepository.findOne({
            where: { username: profileUsername },
        });

        if (!user) {
            throw new HttpException(
                "Profile does not exist",
                HttpStatus.NOT_FOUND
            );
        }

        if (user.id === userId) {
            throw new HttpException(
                "Followed and following user can not be equal",
                HttpStatus.BAD_REQUEST
            );
        }

        const follow = await this.followRepository.findOne({
            where: { followerId: userId, folllowingId: user.id },
        });

        if (!follow) {
            const followToCreate = new FollowEntity();
            followToCreate.followerId = userId;
            followToCreate.folllowingId = user.id;
            await this.followRepository.save(followToCreate);
        }

        return { ...user, following: true };
    }

    async unfollowProfile(
        userId: number,
        profileUsername: string
    ): Promise<ProfileType> {
        const user = await this.userRepository.findOne({
            where: { username: profileUsername },
        });

        if (!user) {
            throw new HttpException(
                "Profile does not exist",
                HttpStatus.NOT_FOUND
            );
        }

        if (user.id === userId) {
            throw new HttpException(
                "Followed and following user can not be equal",
                HttpStatus.BAD_REQUEST
            );
        }

        const follow = await this.followRepository.findOne({
            where: { followerId: userId, folllowingId: user.id },
        });

        await this.followRepository.delete(follow);

        return { ...user, following: false };
    }

    buildProfileResponse(profile: ProfileType): IProfileResponse {
        delete profile.email;
        return { profile };
    }
}
