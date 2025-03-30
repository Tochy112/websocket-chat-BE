import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1743096578877 implements MigrationInterface {
    name = 'FirstMigration1743096578877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`members\` (\`id\` int NOT NULL AUTO_INCREMENT, \`isAdmin\` tinyint NOT NULL DEFAULT 0, \`userId\` int NULL, \`chatId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chat\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('PRIVATE', 'GROUP') NOT NULL DEFAULT 'PRIVATE', \`name\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`senderId\` int NULL, \`chatId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`members\` ADD CONSTRAINT \`FK_839756572a2c38eb5a3b563126e\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`members\` ADD CONSTRAINT \`FK_cda65acb08e35ec29686794e74c\` FOREIGN KEY (\`chatId\`) REFERENCES \`chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_bc096b4e18b1f9508197cd98066\` FOREIGN KEY (\`senderId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_619bc7b78eba833d2044153bacc\` FOREIGN KEY (\`chatId\`) REFERENCES \`chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_619bc7b78eba833d2044153bacc\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_bc096b4e18b1f9508197cd98066\``);
        await queryRunner.query(`ALTER TABLE \`members\` DROP FOREIGN KEY \`FK_cda65acb08e35ec29686794e74c\``);
        await queryRunner.query(`ALTER TABLE \`members\` DROP FOREIGN KEY \`FK_839756572a2c38eb5a3b563126e\``);
        await queryRunner.query(`DROP TABLE \`message\``);
        await queryRunner.query(`DROP TABLE \`chat\``);
        await queryRunner.query(`DROP TABLE \`members\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
