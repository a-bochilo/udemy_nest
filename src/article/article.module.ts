import { UserEntity } from "@app/user/user.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleController } from "./article.controller";
import { ArticleEntity } from "./article.entity";
import { ArticleService } from "./article.service";

@Module({
    controllers: [ArticleController],
    providers: [ArticleService],
    imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity])],
})
export class ArticleModule {}
