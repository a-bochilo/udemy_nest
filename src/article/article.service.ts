import { UserEntity } from "@app/user/user.entity";
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import slugify from "slugify";
import { DataSource, DeleteResult, getRepository, Repository } from "typeorm";
import { ArticleEntity } from "./article.entity";
import { CreateArticleDto } from "./dto/createArcticle.dto";
import { IArticleResponse } from "./types/articleResponse.interface";
import { IArticlesResponse } from "./types/articlesResponse.interface";

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private dataSource: DataSource
    ) {}

    async findAll(userId: number, query: any): Promise<IArticlesResponse> {
        const queryBuilder = this.dataSource
            .getRepository(ArticleEntity)
            .createQueryBuilder("articles")
            .leftJoinAndSelect("articles.author", "author");

        queryBuilder.orderBy("articles.createdAt", "DESC");

        const articlesCount = await queryBuilder.getCount();

        if (query.author) {
            const author = await this.userRepository.findOne({
                where: { username: query.author },
            });
            queryBuilder.andWhere("articles.authorId = :id", {
                id: author.id,
            });
        }

        if (query.tag) {
            queryBuilder.andWhere("articles.taglist LIKE :tag", {
                tag: `%${query.tag}%`,
            });
        }

        if (query.limit) {
            queryBuilder.limit(query.limit);
        }

        if (query.offset) {
            queryBuilder.offset(query.offset);
        }

        if (query.favorited) {
            const author = await this.userRepository.findOne({
                where: { username: query.favorited },
                relations: ["favorites"],
            });

            const ids = author.favorites.map((el) => el.id);
            if (ids.length) {
                queryBuilder.andWhere("articles.id IN (:...ids)", { ids });
            } else {
                queryBuilder.andWhere("1=0");
            }
        }

        let favoriteIds: number[] = [];

        if (userId) {
            const user = await this.userRepository.findOne({
                where: { id: userId },
                relations: ["favorites"],
            });
            favoriteIds = user.favorites.map((favorite) => favorite.id);
        }

        const articles = await queryBuilder.getMany();
        const articlesWithFavorites = articles.map((article) => {
            const favorited = favoriteIds.includes(article.id);
            return { ...article, favorited };
        });

        return { articles: articlesWithFavorites, articlesCount };
    }

    async createArticle(
        currUser: UserEntity,
        createArticleDto: CreateArticleDto
    ): Promise<ArticleEntity> {
        const article = new ArticleEntity();
        Object.assign(article, createArticleDto);
        if (article.taglist) {
            article.taglist = [];
        }

        article.slug = this.getSlug(createArticleDto.title);

        article.author = currUser;
        return await this.articleRepository.save(article);
    }

    async findBySlug(slug: string): Promise<ArticleEntity> {
        return await this.articleRepository.findOne({
            where: { slug },
        });
    }

    async updateArticle(
        slug: string,
        userId: number,
        updateArticleDto: CreateArticleDto
    ): Promise<ArticleEntity> {
        const article = await this.findBySlug(slug);

        if (!article) {
            throw new HttpException(
                "Article does not exist",
                HttpStatus.NOT_FOUND
            );
        }

        if (article.author.id !== userId) {
            throw new HttpException(
                "You are not an author",
                HttpStatus.FORBIDDEN
            );
        }

        Object.assign(article, updateArticleDto);

        return this.articleRepository.save(article);
    }

    async deleteArticle(slug: string, userId: number): Promise<DeleteResult> {
        const article = await this.findBySlug(slug);
        if (!article) {
        }
        if (article.author.id !== userId) {
            throw new HttpException(
                "You are not an author",
                HttpStatus.FORBIDDEN
            );
        }

        return await this.articleRepository.delete({ slug });
    }

    async addArticleToFavorites(
        slug: string,
        userId: number
    ): Promise<ArticleEntity> {
        const article = await this.findBySlug(slug);
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["favorites"],
        });

        const isNotFavorited =
            user.favorites.findIndex(
                (articleInFavorites) => articleInFavorites.id === article.id
            ) === -1;
        if (isNotFavorited) {
            user.favorites.push(article);
            article.favoritsCount += 1;
            await this.userRepository.save(user);
            await this.articleRepository.save(article);
        }

        return article;
    }
    async deleteArticleFromFavorites(
        slug: string,
        userId: number
    ): Promise<ArticleEntity> {
        const article = await this.findBySlug(slug);
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["favorites"],
        });

        const articleIndex = user.favorites.findIndex(
            (articleInFavorites) => articleInFavorites.id === article.id
        );

        if (articleIndex >= 0) {
            user.favorites.splice(articleIndex, 1);
            article.favoritsCount -= 1;
            await this.userRepository.save(user);
            await this.articleRepository.save(article);
        }

        return article;
    }

    buildArticleResponse(article: ArticleEntity) {
        return { article: article };
    }

    private getSlug(title: string): string {
        const slug = slugify(title, {
            lower: true,
            replacement: "-",
            trim: true,
            remove: /[*+~.()'"!:@]/g,
        });
        const uniqImpurity = ((Math.random() * Math.pow(36, 6)) | 0).toString(
            36
        );
        return `${slug}-${uniqImpurity}`;
    }
}
