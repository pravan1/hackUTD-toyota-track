import { Router } from 'express';
import { getVehicleById, getVehicles } from '../controllers/vehicleController.js';

const router = Router();

router.get('/', getVehicles);
router.get('/:id', getVehicleById);

export default router;

