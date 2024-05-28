const express = require('express');
const dotenv = require('dotenv');
const routers = require('./routers');
const errorHandler = require('./middlewares/error-handler.middleware');

dotenv.config();

const app = express();

app.use(express.json());

app.use('/', routers);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});
