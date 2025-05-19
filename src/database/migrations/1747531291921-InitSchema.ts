import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1747531291921 implements MigrationInterface {
    name = 'InitSchema1747531291921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "likes" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "liked_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "post_id" uuid, CONSTRAINT "user_post_unique" UNIQUE ("user_id", "post_id"), CONSTRAINT "PK_6fe877f322d4062835ced7e2067" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "message" text NOT NULL, "published_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_8e38e2174528cd9534fa3b9bec3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "birth_date" date NOT NULL, "username" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "password_hash" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5d240a524836c0224802471082d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "username_unique" ON "users" ("username")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "email_unique" ON "users" ("email")`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_66edc1df5a9848fb069b08f681b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_3306a06645fe1ee99de62b082de" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_abe1ce42ee67843ab84d8f69396" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

        await queryRunner.query(`INSERT INTO "users" (id, first_name, last_name, birth_date, username, email, password_hash) VALUES
            ('a1e4db00-7e3e-44f3-b8d3-d09dabc11c11', 'Andrés', 'Medina', '1990-01-01', 'andres', 'andres@example.com', '$2b$12$NzX99PtyJUBUbldaLObugOihaMY3Pz21dATMxy7fbfsOQFEtb/ZIO'),
            ('b3a2cc52-1835-40f7-8c0b-3a41e8d8c622', 'María', 'Gómez', '1992-06-10', 'maria', 'maria@example.com', '$2b$12$NzX99PtyJUBUbldaLObugOihaMY3Pz21dATMxy7fbfsOQFEtb/ZIO'),
            ('c7df50c6-91e2-4e02-a894-1a75c10947de', 'Juan', 'Rodríguez', '1991-03-15', 'juan', 'juan@example.com', '$2b$12$NzX99PtyJUBUbldaLObugOihaMY3Pz21dATMxy7fbfsOQFEtb/ZIO'),
            ('d4ec9bfe-5244-437f-a76c-0f2b8dc1f7ba', 'Laura', 'Martínez', '1989-07-20', 'laura', 'laura@example.com', '$2b$12$NzX99PtyJUBUbldaLObugOihaMY3Pz21dATMxy7fbfsOQFEtb/ZIO')`);

        await queryRunner.query(`INSERT INTO "posts" (message, user_id) VALUES
            ('Post 1 de Andrés', 'a1e4db00-7e3e-44f3-b8d3-d09dabc11c11'),
            ('Post 2 de María',  'b3a2cc52-1835-40f7-8c0b-3a41e8d8c622'),
            ('Post 3 de Juan',   'c7df50c6-91e2-4e02-a894-1a75c10947de'),
            ('Post 4 de Laura',  'd4ec9bfe-5244-437f-a76c-0f2b8dc1f7ba'),
            ('Post 5 de Andrés', 'a1e4db00-7e3e-44f3-b8d3-d09dabc11c11'),
            ('Post 6 de María',  'b3a2cc52-1835-40f7-8c0b-3a41e8d8c622'),
            ('Post 7 de Juan',   'c7df50c6-91e2-4e02-a894-1a75c10947de')`);

        await queryRunner.query(`INSERT INTO "likes" (user_id, post_id) VALUES
            ('b3a2cc52-1835-40f7-8c0b-3a41e8d8c622', (SELECT id FROM posts WHERE message = 'Post 1 de Andrés')),
            ('c7df50c6-91e2-4e02-a894-1a75c10947de', (SELECT id FROM posts WHERE message = 'Post 1 de Andrés')),
            ('d4ec9bfe-5244-437f-a76c-0f2b8dc1f7ba', (SELECT id FROM posts WHERE message = 'Post 1 de Andrés')),
            ('a1e4db00-7e3e-44f3-b8d3-d09dabc11c11', (SELECT id FROM posts WHERE message = 'Post 2 de María')),
            ('c7df50c6-91e2-4e02-a894-1a75c10947de', (SELECT id FROM posts WHERE message = 'Post 2 de María')),
            ('a1e4db00-7e3e-44f3-b8d3-d09dabc11c11', (SELECT id FROM posts WHERE message = 'Post 3 de Juan')),
            ('b3a2cc52-1835-40f7-8c0b-3a41e8d8c622', (SELECT id FROM posts WHERE message = 'Post 3 de Juan')),
            ('d4ec9bfe-5244-437f-a76c-0f2b8dc1f7ba', (SELECT id FROM posts WHERE message = 'Post 3 de Juan')),
            ('a1e4db00-7e3e-44f3-b8d3-d09dabc11c11', (SELECT id FROM posts WHERE message = 'Post 4 de Laura')),
            ('b3a2cc52-1835-40f7-8c0b-3a41e8d8c622', (SELECT id FROM posts WHERE message = 'Post 5 de Andrés')),
            ('d4ec9bfe-5244-437f-a76c-0f2b8dc1f7ba', (SELECT id FROM posts WHERE message = 'Post 5 de Andrés')),
            ('a1e4db00-7e3e-44f3-b8d3-d09dabc11c11', (SELECT id FROM posts WHERE message = 'Post 6 de María')),
            ('b3a2cc52-1835-40f7-8c0b-3a41e8d8c622', (SELECT id FROM posts WHERE message = 'Post 7 de Juan')),
            ('d4ec9bfe-5244-437f-a76c-0f2b8dc1f7ba', (SELECT id FROM posts WHERE message = 'Post 7 de Juan'))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_abe1ce42ee67843ab84d8f69396"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_3306a06645fe1ee99de62b082de"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_66edc1df5a9848fb069b08f681b"`);
        await queryRunner.query(`DROP INDEX "public"."email_unique"`);
        await queryRunner.query(`DROP INDEX "public"."username_unique"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "likes"`);
    }
}
