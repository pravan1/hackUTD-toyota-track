import { Router } from 'express';
import {
  getMe,
  removeSavedVehicle,
  saveVehicle
} from '../controllers/userController.js';
import { checkJwt, requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(checkJwt, requireAuth);

router.get('/me', getMe);
router.post('/me/saved-vehicles', saveVehicle);
router.delete('/me/saved-vehicles/:vehicleId', removeSavedVehicle);

export default router;

