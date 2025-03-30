import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: configService.get('MYSQL_HOST'),
  port: parseInt(configService.get('MYSQL_PORT') || '3306', 10),
  username: configService.get('MYSQL_USER'),
  password: configService.get('MYSQL_PASSWORD'),
  database: configService.get('MYSQL_DATABASE'),
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [`${__dirname}/../src/**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
});

console.log("hello:", AppDataSource.options.entities);
