import { Router } from 'express';
import {
  deletePreferences,
  getMyPreferences,
  savePreferences,
  submitVehicleProfile,
  getVehicleProfile
} from '../controllers/preferenceController.js';
import { checkJwt, requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(checkJwt, requireAuth);

router.get('/me', getMyPreferences);
router.post('/', savePreferences);
router.delete('/', deletePreferences);
router.post('/vehicle-profile', submitVehicleProfile);
router.get('/vehicle-profile', getVehicleProfile);

export default router;

