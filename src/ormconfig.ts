import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { TagEntity } from "@app/tag/tag.entity";

const ormconfig: PostgresConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "123",
    database: "udemy_nest",
    entities: [TagEntity],
    synchronize: false,
    migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
};

export default ormconfig;
