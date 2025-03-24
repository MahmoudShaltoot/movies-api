import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMoviesTable1742784539779 implements MigrationInterface {
    name = 'CreateMoviesTable1742784539779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "movies" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "original_title" character varying NOT NULL, "poster_path" character varying NOT NULL, "overview" character varying NOT NULL, "original_language" character varying NOT NULL, "release_date" date NOT NULL, "external_id" integer, "genre_ids" integer array NOT NULL, "vote_count" integer NOT NULL DEFAULT '0', "average_rating" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_5aa0bbd146c0082d3fc5a0ad5d8" UNIQUE ("title"), CONSTRAINT "UQ_acb0915a1e85bd274a1d0787911" UNIQUE ("original_title"), CONSTRAINT "UQ_a2fab567801ad75b0e1f77ba8cd" UNIQUE ("poster_path"), CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "movies"`);
    }

}
