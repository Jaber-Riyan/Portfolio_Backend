import { Router } from 'express';
import {
  getPortfolio,
  updatePortfolio,
  updatePortfolioSection,
  seedPortfolio,
} from '../controllers/portfolioController';
import { authorizeAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getPortfolio);
router.put('/', authorizeAdmin, updatePortfolio);
router.patch('/:section', authorizeAdmin, updatePortfolioSection);
router.post('/seed', authorizeAdmin, seedPortfolio);

export default router;
