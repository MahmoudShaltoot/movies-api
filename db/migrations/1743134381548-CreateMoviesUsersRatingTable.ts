import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMoviesUsersRatingTable1743134381548 implements MigrationInterface {
    name = 'CreateMoviesUsersRatingTable1743134381548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "movies_users_rating" ("id" SERIAL NOT NULL, "rating" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "movie_id" integer, CONSTRAINT "PK_6c642cc5551e32202d50889bb56" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "movies_users_rating" ADD CONSTRAINT "FK_b74f5e89556724d453cca546cd0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movies_users_rating" ADD CONSTRAINT "FK_0d3520a2575f50d593274fa33ad" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies_users_rating" DROP CONSTRAINT "FK_0d3520a2575f50d593274fa33ad"`);
        await queryRunner.query(`ALTER TABLE "movies_users_rating" DROP CONSTRAINT "FK_b74f5e89556724d453cca546cd0"`);
        await queryRunner.query(`DROP TABLE "movies_users_rating"`);
    }

}
