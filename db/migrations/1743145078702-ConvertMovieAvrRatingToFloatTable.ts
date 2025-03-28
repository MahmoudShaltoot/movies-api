import { MigrationInterface, QueryRunner } from "typeorm";

export class ConvertMovieAvrRatingToFloatTable1743145078702 implements MigrationInterface {
    name = 'ConvertMovieAvrRatingToFloatTable1743145078702'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "average_rating"`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "average_rating" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "average_rating"`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "average_rating" integer NOT NULL DEFAULT '0'`);
    }

}
