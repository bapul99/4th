const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma.util');

// 라우터를 생성합니다.

const router = express.Router();

router.post('/register', async (req, res, next) => {
  const { email, password, passwordConfirm, name } = req.body;

  if (!email || !password || !passwordConfirm || !name) {
    return res.status(400).json({ message: '모든 필드를 입력해 주세요.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: '이메일 형식이 올바르지 않습니다.' });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: '비밀번호는 6자리 이상이어야 합니다.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: '이미 가입 된 사용자입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'APPLICANT',
      },
    });

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

// 로그인 라우터를 작성합니다.

const jwt = require('jsonwebtoken');

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 입력해 주세요.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: '인증 정보가 유효하지 않습니다.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: '인증 정보가 유효하지 않습니다.' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });

    res.json({ accessToken: token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
