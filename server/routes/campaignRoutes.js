import express from 'express';
import {
  getCampaigns,
  getTopFundedCampaigns,
  getPublicStats,
  getMyCampaigns,
  getPendingCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  updateCampaignStatus,
  deleteCampaign,
  adminDeleteCampaign,
} from '../controllers/campaignController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCampaigns);
router.get('/top-funded', getTopFundedCampaigns);
router.get('/stats/public', getPublicStats);
router.get('/mine', verifyToken, verifyRole('creator'), getMyCampaigns);
router.get('/pending', verifyToken, verifyRole('admin'), getPendingCampaigns);
router.get('/:id', getCampaignById);
router.post('/', verifyToken, verifyRole('creator'), createCampaign);
router.patch('/:id', verifyToken, verifyRole('creator'), updateCampaign);
router.patch('/:id/status', verifyToken, verifyRole('admin'), updateCampaignStatus);
router.delete('/:id', verifyToken, verifyRole('creator'), deleteCampaign);
router.delete('/:id/admin', verifyToken, verifyRole('admin'), adminDeleteCampaign);

export default router;
