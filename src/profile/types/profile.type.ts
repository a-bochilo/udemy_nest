import { UserEntity } from "@app/user/user.entity";

export type ProfileType = Omit<UserEntity, "hashPassword"> & {
    following: boolean;
};
