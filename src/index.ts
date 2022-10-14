import 'reflect-metadata';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Game } from './entities/game';

dotenv.config();

interface Result {
  index: number;
  drink: number;
  detail: {
    name: string;
    base: number;
    main: number[];
    sub: number[];
    garnish: number;
    glass: number;
    title: string;
    comment: string;
  };
}

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

app.post('/new',async (req:Request, res: Response) => {
  const result : object[] = [];
  const game = await AppDataSource.getRepository(Game).create({ 
    name: req.body.name,
    background: req.body.background,
    showcase: req.body.showcase,
    result: JSON.stringify(result)
   });
  const gameResult = await AppDataSource.getRepository(Game).save(game);
   
  return res.send(gameResult);
})

app.get('/', async (req: Request, res: Response) => {
  res.send(200);
});

const PORT = 4000;

try {
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}

function drinkCode(mainIdxs: number[], subIdxs: number[], ganish: number) {
  //똑부러짐 뚝딱거림 귀여움 시크함 다정함 무뚝뚝함 투머치토커 과묵함 유잼 노잼 섬세함 둔감함 대식가 소식가 호불호확실 팔랑귀 밖순이 집순이 연애고수 연애고자
  let cnt1 = 0;
  let cnt2 = 0;

  const arr = [
    [30, 30, 20, 20],
    [30, 30, 20, 20],
    [130, 130, 120, 120],
    [130, 130, 120, 120],
  ];
  for (let i = 0; i < mainIdxs.length; i++) {
    cnt1 += (mainIdxs[i] + 1) % 2;
    cnt2 += (subIdxs[i] + 1) % 2;
  }

  return arr[cnt1][cnt2] + ganish;
}
