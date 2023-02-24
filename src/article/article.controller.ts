import { AuthGuard } from "@app/user/guards/auth.guard";
import { UserEntity } from "@app/user/user.entity";
import {
    Body,
    Controller,
    Post,
    UseGuards,
    Get,
    Put,
    Param,
    Delete,
    UsePipes,
    Query,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { User } from "../user/decorators/user.decorator";
import { CreateArticleDto } from "./dto/createArcticle.dto";
import { IArticleResponse } from "./types/articleResponse.interface";
import { DeleteResult } from "typeorm";
import { IArticlesResponse } from "./types/articlesResponse.interface";
import { BackendValidationPipe } from "@app/shared/pipes/backendValidation.pipe";

@Controller("articles")
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Get("feed")
    @UseGuards(AuthGuard)
    async getFeed(
        @User("id") userId: number,
        @Query() query: any
    ): Promise<IArticlesResponse> {
        return this.articleService.getFeed(userId, query);
    }

    @Get()
    async findAll(
        @User("id") userId: number,
        @Query() query: any
    ): Promise<IArticlesResponse> {
        return await this.articleService.findAll(userId, query);
    }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new BackendValidationPipe())
    async create(
        @User() currUser: UserEntity,
        @Body("article") createArticleDto: CreateArticleDto
    ): Promise<IArticleResponse> {
        const article = await this.articleService.createArticle(
            currUser,
            createArticleDto
        );
        return this.articleService.buildArticleResponse(article);
    }

    @Get(":slug")
    async getSingleArticle(
        @Param("slug") slug: string
    ): Promise<IArticleResponse> {
        const article = await this.articleService.findBySlug(slug);
        return this.articleService.buildArticleResponse(article);
    }

    @Delete(":slug")
    @UseGuards(AuthGuard)
    async deleteArticle(
        @User("id") userId: number,
        @Param("slug") slug: string
    ): Promise<DeleteResult> {
        return await this.articleService.deleteArticle(slug, userId);
    }

    @Put(":slug")
    @UseGuards(AuthGuard)
    @UsePipes(new BackendValidationPipe())
    async updateArticle(
        @User("id") userId: number,
        @Param("slug") slug: string,
        @Body("article") updateArticleDto: CreateArticleDto
    ): Promise<IArticleResponse> {
        const article = await this.articleService.updateArticle(
            slug,
            userId,
            updateArticleDto
        );
        return this.articleService.buildArticleResponse(article);
    }

    @Post(":slug/favorite")
    @UseGuards(AuthGuard)
    async addArticleToFavorites(
        @User("id") userId: number,
        @Param("slug") slug: string
    ): Promise<IArticleResponse> {
        const article = await this.articleService.addArticleToFavorites(
            slug,
            userId
        );
        return this.articleService.buildArticleResponse(article);
    }

    @Delete(":slug/favorite")
    @UseGuards(AuthGuard)
    async deleteArticleFromFavorites(
        @User("id") userId: number,
        @Param("slug") slug: string
    ): Promise<IArticleResponse> {
        const article = await this.articleService.deleteArticleFromFavorites(
            slug,
            userId
        );
        return this.articleService.buildArticleResponse(article);
    }
}
