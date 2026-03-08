import { Router } from 'express';
import multer from 'multer';
import { 
  createComplaint, 
  getComplaints, 
  getUserComplaints, 
  getAllComplaints, 
  getDepartmentComplaints, 
  assignComplaint, 
  updateComplaint, 
  resolveComplaint,
  getEmergencyAlerts,
  getHeatmapData 
} from '../controllers/complaintController';
import { authMiddleware } from '../middleware/auth';

const upload = multer({ dest: 'uploads/' });

const router = Router();

// Public endpoints (no auth required)
router.get('/department/:department', getDepartmentComplaints);
router.get('/data/heatmap', getHeatmapData);

// Protected endpoints (auth required)
router.use(authMiddleware);

router.post('/', upload.single('image'), createComplaint);
router.get('/', getComplaints);
router.get('/user/:userId', getUserComplaints);
router.get('/all', getAllComplaints);
router.get('/alerts/emergency', getEmergencyAlerts);
router.put('/:id/assign', assignComplaint);
router.put('/:id/resolve', upload.single('proof'), resolveComplaint);
router.put('/:id', updateComplaint);

export default router;
