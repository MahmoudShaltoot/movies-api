import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWatchlistsTable1743258158908 implements MigrationInterface {
    name = 'CreateWatchlistsTable1743258158908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "watchlists" ("id" SERIAL NOT NULL, "user_id" integer, "movie_id" integer, CONSTRAINT "UQ_6ff15f6b6ce20770e685250da15" UNIQUE ("user_id", "movie_id"), CONSTRAINT "PK_aa3c717b50a10f7a435c65eda5a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "watchlists" ADD CONSTRAINT "FK_3e8bccad3dcd75fa977892c54bb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "watchlists" ADD CONSTRAINT "FK_ed1a77721bb1d516d8f6113db1d" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "watchlists" DROP CONSTRAINT "FK_ed1a77721bb1d516d8f6113db1d"`);
        await queryRunner.query(`ALTER TABLE "watchlists" DROP CONSTRAINT "FK_3e8bccad3dcd75fa977892c54bb"`);
        await queryRunner.query(`DROP TABLE "watchlists"`);
    }

}
