import 'reflect-metadata';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { DataSource } from 'typeorm';
import { Game } from './entities/game';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: false,
  entities: ['src/entities/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.subscriber.ts'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

const app: Application = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', async (req: Request, res: Response) => {
  res.send(200);
});

app.post('/game/:gameId', async (req: Request, res: Response) => {
  try {
    const game = await AppDataSource.getRepository(Game)
      .createQueryBuilder('index')
      .where('game.id == :id', { id: req.params.gameId })
      .getOne();

    const result = JSON.parse(game!.result);
    let idx = 0;

    if (result[result.length - 1].index == 0) {
      idx = 0;
    } else {
      idx = result[result.length - 1].index;
    }

    const q = await AppDataSource.getRepository(Game).create({
      result: result.map((detail: any) => {
        return {
          index: idx + 1,
          name: detail.name,
          base: detail.base,
          main: detail.main,
          sub: detail.sub,
          garnish: detail.garnish,
          glass: detail.glass,
          title: detail.title,
          comment: detail.comment,
        };
      }),
    });
    return res.send(q);
  } catch (e) {
    console.log(e);
  }
});

const PORT = 4000;

try {
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
