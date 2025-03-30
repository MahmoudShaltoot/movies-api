import { MigrationInterface, QueryRunner } from "typeorm";

export class NullablePosterPath1743321217927 implements MigrationInterface {
    name = 'NullablePosterPath1743321217927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" ALTER COLUMN "poster_path" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movies" DROP CONSTRAINT "UQ_a2fab567801ad75b0e1f77ba8cd"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" ADD CONSTRAINT "UQ_a2fab567801ad75b0e1f77ba8cd" UNIQUE ("poster_path")`);
        await queryRunner.query(`ALTER TABLE "movies" ALTER COLUMN "poster_path" SET NOT NULL`);
    }

}
