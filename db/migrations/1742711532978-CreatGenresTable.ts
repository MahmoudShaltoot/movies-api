import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatGenresTable1742711532978 implements MigrationInterface {
    name = 'CreatGenresTable1742711532978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "genres" ("id" SERIAL NOT NULL, "external_id" integer, "name" character varying NOT NULL, CONSTRAINT "UQ_f105f8230a83b86a346427de94d" UNIQUE ("name"), CONSTRAINT "PK_80ecd718f0f00dde5d77a9be842" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "genres"`);
    }

}
