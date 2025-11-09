import { Router } from 'express';
import {
  getRecommendations,
  getVehicleSummary
} from '../controllers/geminiController.js';
import { checkJwt, requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(checkJwt, requireAuth);

router.post('/vehicle-summary', getVehicleSummary);
router.post('/recommendations', getRecommendations);

export default router;

