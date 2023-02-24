import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDB1677221182558 implements MigrationInterface {
    name = "SeedDB1677221182558";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            // password: 123
            `INSERT INTO users (username, email, password) VALUES ('superIvan', 'superivan@gmail.com', '$2b$10$8b8W.5dekId1XBYlEkHHNungRH8RCMvwf8iZbjVBc24UoDtQe4FBm')`
        );
        await queryRunner.query(
            `INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`
        );

        await queryRunner.query(
            `INSERT INTO articles (slug, title, description, body, taglist, "authorId") VALUES ('first-slug-isat3i', 'first title', 'first descr', 'first body', 'coffee,dragons', 1)`
        );
        await queryRunner.query(
            `INSERT INTO articles (slug, title, description, body, taglist, "authorId") VALUES ('second-slug-isat3i', 'second title', 'second descr', 'second body', 'coffee,nestjs', 1)`
        );
    }

    public async down(): Promise<void> {}
}
