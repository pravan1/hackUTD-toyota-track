import { Router } from 'express';
import {
  deletePreferences,
  getMyPreferences,
  savePreferences
} from '../controllers/preferenceController.js';
import { checkJwt, requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(checkJwt, requireAuth);

router.get('/me', getMyPreferences);
router.post('/', savePreferences);
router.delete('/', deletePreferences);

export default router;

