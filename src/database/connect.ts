import { DataSource } from 'typeorm';

export const mongoDataSource = new DataSource({
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  database: 'test',
});
