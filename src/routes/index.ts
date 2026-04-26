import { Router } from 'express';

const router = Router();

router.use('/auth', require('./auth').default);
router.use('/portfolio', require('./portfolio').default);

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio CMS API is running',
    version: '1.0.0',
  });
});

export default router;
