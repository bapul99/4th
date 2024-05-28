const express = require('express');
const prisma = require('../utils/prisma.util');
const requireAccessToken = require('../middlewares/require-access-token.middleware');
const { STATUS } = require('../constants/resume.constant');

const router = express.Router();

router.use(requireAccessToken);

router.post('/', async (req, res, next) => {
  const { title, content } = req.body;
  const { userId } = req.user;

  if (!title || !content) {
    return res.status(400).json({ message: '제목과 내용을 입력해주세요.' });
  }

  if (content.length < 150) {
    return res.status(400).json({ message: '내용은 최소 150자 이상이어야 합니다.' });
  }

  try {
    const resume = await prisma.resume.create({
      data: {
        userId,
        title,
        content,
        status: STATUS.APPLY,
      },
    });

    res.status(201).json(resume);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  const { userId } = req.user;
  const { sort = 'DESC' } = req.query;

  try {
    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: sort.toUpperCase() === 'ASC' ? 'asc' : 'desc' },
      include: { user: { select: { name: true } } },
    });

    res.json(resumes);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  const { userId } = req.user;
  const { id } = req.params;

  try {
    const resume = await prisma.resume.findFirst({
      where: { id: Number(id), userId },
      include: { user: { select: { name: true } } },
    });

    if (!resume) {
      return res.status(404).json({ message: '이력서를 찾을 수 없습니다.' });
    }

    res.json(resume);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  const { userId } = req.user;
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title && !content) {
    return res.status(400).json({ message: '수정할 내용을 입력해주세요.' });
  }

  try {
    const resume = await prisma.resume.findFirst({
      where: { id: Number(id), userId },
    });

    if (!resume) {
      return res.status(404).json({ message: '이력서를 찾을 수 없습니다.' });
    }

    const updatedResume = await prisma.resume.update({
      where: { id: Number(id) },
      data: {
        title: title || resume.title,
        content: content || resume.content,
      },
    });

    res.json(updatedResume);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  const { userId } = req.user;
  const { id } = req.params;

  try {
    const resume = await prisma.resume.findFirst({
      where: { id: Number(id), userId },
    });

    if (!resume) {
      return res.status(404).json({ message: '이력서를 찾을 수 없습니다.' });
    }

    await prisma.resume.delete({
      where: { id: Number(id) },
    });

    res.json({ message: '이력서가 삭제되었습니다.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
