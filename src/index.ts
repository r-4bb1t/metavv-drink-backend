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
      .createQueryBuilder('game')
      .where('game.id = :id', { id: req.params.gameId })
      .getOne();

    if (!game) return res.send(404);

    const result = JSON.parse(game!.result);
    const idx = result.length;

    const q: any[] = [
      ...result,
      {
        index = idx + 1,
        name: result.detail.name,
        base: result.detail.base,
        main: result.detail.main,
        sub: result.detail.sub,
        garnish: result.detail.garnish,
        glass: result.detail.glass,
        title: result.detail.title,
        comment: result.detail.comment,
      },
    ];
    await AppDataSource.getRepository(Game).update(result, q);
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
