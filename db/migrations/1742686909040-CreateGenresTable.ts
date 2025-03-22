import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGenresTable1742686909040 implements MigrationInterface {
    name = 'CreateGenresTable1742686909040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "genres" ("id" SERIAL NOT NULL, "external_id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_a49fe14ec18e8c2ecee6bcec7d0" UNIQUE ("external_id"), CONSTRAINT "PK_80ecd718f0f00dde5d77a9be842" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "genres"`);
    }

}
