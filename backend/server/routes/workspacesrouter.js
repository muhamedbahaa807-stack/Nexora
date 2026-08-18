import { Router } from 'express';
import { verifyAccessToken } from '../middlewares/verifyaccesstoken.js';
import {
  addworkspace,
  getmyworkspaces,
  getworkspace,
  updateWS,
  deleteWS,
} from '../controllers/workspacescontroller.js';
import { checkSchema } from 'express-validator';
import { workspaceSchema } from '../utils/validations.js';
import { authorize } from '../middlewares/authorize.js';
const router = Router();
router.post(
  '/api/workspace',
  verifyAccessToken,
  checkSchema(workspaceSchema),
  addworkspace,
);
router.get('/api/workspaces', verifyAccessToken, getmyworkspaces);
router.get('/api/workspace/:id', verifyAccessToken, getworkspace);
router.patch(
  '/api/workspace/:id',
  verifyAccessToken,
  authorize('owner'),
  updateWS,
);
router.delete(
  '/api/workspace/:id',
  verifyAccessToken,
  authorize('owner'),
  deleteWS,
);
export default router;
