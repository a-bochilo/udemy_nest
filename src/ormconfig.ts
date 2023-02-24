import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { TagEntity } from "@app/tag/tag.entity";
import { CreateTags1677065806346 } from "./migrations/1677065806346-CreateTags";
import { UserEntity } from "./user/user.entity";
import { CreateUsers1677074248429 } from "./migrations/1677074248429-CreateUsers";
import { AddUserNameToUsers1677077102950 } from "./migrations/1677077102950-AddUserNameToUsers";
import { ArticleEntity } from "./article/article.entity";
import { ArticleEntity1677150429574 } from "./migrations/1677150429574-ArticleEntity";
import { AddRelationsArticlesAndUsers1677151761618 } from "./migrations/1677151761618-AddRelationsArticlesAndUsers";
import { AddFavoritesRelationsArticlesAndUsers1677221182558 } from "./migrations/1677221182558-AddFavoritesRelationsArticlesAndUsers";
import { FollowEntity } from "./profile/follow.entity";
import { CreateFollowEntity1677231565109 } from "./migrations/1677231565109-CreateFollowEntity";

const ormconfig: PostgresConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "123",
    database: "udemy_nest",
    entities: [TagEntity, UserEntity, ArticleEntity, FollowEntity],
    synchronize: false,
    migrations: [
        CreateTags1677065806346,
        CreateUsers1677074248429,
        AddUserNameToUsers1677077102950,
        ArticleEntity1677150429574,
        AddRelationsArticlesAndUsers1677151761618,
        AddFavoritesRelationsArticlesAndUsers1677221182558,
        CreateFollowEntity1677231565109,
    ],
};

export default ormconfig;
