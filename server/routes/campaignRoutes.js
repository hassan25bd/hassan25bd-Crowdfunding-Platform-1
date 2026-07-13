import express from 'express';
import {
  getCampaigns,
  getTopFundedCampaigns,
  getMyCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from '../controllers/campaignController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCampaigns);
router.get('/top-funded', getTopFundedCampaigns);
router.get('/mine', verifyToken, verifyRole('creator'), getMyCampaigns);
router.get('/:id', getCampaignById);
router.post('/', verifyToken, verifyRole('creator'), createCampaign);
router.patch('/:id', verifyToken, verifyRole('creator'), updateCampaign);
router.delete('/:id', verifyToken, verifyRole('creator'), deleteCampaign);

export default router;
