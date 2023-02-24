import { ArticleEntity } from "../article.entity";

export interface IArticlesResponse {
    articles: Omit<ArticleEntity, "updateTimestamp">[];
    articlesCount: number;
}
