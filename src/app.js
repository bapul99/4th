const express = require('express');
const dotenv = require('dotenv');
const prisma = require('./utils/prisma.util');
const authRouter = require('./routers/auth.router');

dotenv.config();

const app = express();

app.use(express.json());
app.use('/auth', authRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 예외 처리 미들웨어를 불러옵니다.
const errorHandler = require('./middlewares/error-handler.middleware');

app.use(errorHandler);

// prisma 객체를 불러옵니다.
const prisma = require('./utils/prisma.util');

