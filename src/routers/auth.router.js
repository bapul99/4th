const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma.util');
const { TOKEN_SECRET } = require('../constants/auth.constant');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  const { email, password, passwordConfirm, name } = req.body;

  if (!email || !password || !passwordConfirm || !name) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 사용자입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'APPLICANT',
      },
    });

    res.status(201).json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: '잘못된 자격 증명입니다.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: '잘못된 자격 증명입니다.' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, TOKEN_SECRET, { expiresIn: '12h' });

    res.json({ accessToken: token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
