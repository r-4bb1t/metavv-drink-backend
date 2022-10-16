import 'reflect-metadata';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import {Game} from `./entities/game`; //데이터베이스 가져오기
import { getMaxListeners } from 'process';


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
// 앱 데이터 패스워드 등등

AppDataSource.initialize() //앱 데이터 초기화
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

const app: Application = express(); // express 메소드를 app에 호출

app.use(cors()); // cors 함수 호출
app.use(bodyParser.urlencoded({ extended: false })); //bodyparser가 express generator에 내장되어있음
app.use(bodyParser.json()); // 그걸 사용하는 구문

app.get('/', async (req: Request, res: Response) => {
  res.send(200);
});

app.post('/upload', upload.single('image'), async (req, res) => {
  res.send({ url: (req.file as any).location });
});

// 안준현 post
app.post('/new', async(req:Request,res:Response)) => {
  const result : object[] = [];
  const game = await AppDataSource.getRepository(Game).create({
    name : req.body.name,
    background : req.body.background
    showcase : req.body.showcase
    result : JSON.stringify(result)
  });
  const gameResult = await AppDataSource.getRepository(Game).save(game);

  return res.send(gameResult);
};
// game 상수를 만들어 정보를 넣고 result객체를 만들어서 json형식으로 나중에 넣어준다.

// get으로 접근했을 때
app.get('/:gameId', async function(req:Request, res:Response)) {
  const results = await AppDataSource.getRepository(Game).findOneBy({
    id: req.params.gameId,
});
return res.send(results);
};
  /* 요 부분은 request가 없으니까 없어도 되는거지?
  const total = await AppDataSource.getRepository(Game).create({
    gameId : req.body.gameId,
    result :{
      index : req.body.index,
      drink : req.body.drink,
      detail : {
        name : req.body.name,
        base : req.body.base,
        main : req.body.main,
        sub : req.body.sub,
        garnish : req.body.garnish,
        glass : req.body.glass,
        title : req.body.title,
        comment : req.body.comment,
      },
    },
    name : req.body.name,
    background : req.body.background,
    showcase : req.body.showcase
  })
*/

  /* return res.send({
    result :{
      index : game.index,
      drink : game.drink,
      detail : {
        name : game.name,
        base : game.base,
        main : game.main,
        sub : game.sub,
        garnish : game.garnish,
        glass : game.glass,
        title : game.title,
        comment : game.comment,
      },
    },
  })
}*/



const PORT = 4000;

try {
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
