import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { verifyAccessToken } from '../middlewares/verifyaccesstoken.js';
import { authorize } from '../middlewares/authorize.js';
import {
  addproject,
  deleteproject,
  getproject,
  getprojects,
  updateproject,
} from '../controllers/projectscontroller.js';
import {
  projectValidation,
  updateProjectValidation,
} from '../utils/validations.js';
const router = Router();
router.post(
  '/workspaces/:workspaceId/projects',
  verifyAccessToken,
  authorize('owner', 'admin'),
  checkSchema(projectValidation),
  addproject,
);
router.get('/workspaces/:workspaceId/projects', verifyAccessToken, getprojects);
router.get(
  '/workspaces/:workspaceId/projects/:projectId',
  verifyAccessToken,
  getproject,
);
router.patch(
  '/workspaces/:workspaceId/projects/:projectId',
  verifyAccessToken,
  authorize('owner', 'admin'),
  checkSchema(updateProjectValidation),
  updateproject,
);
router.delete(
  '/workspaces/:workspaceId/projects/:projectId',
  verifyAccessToken,
  authorize('owner', 'admin'),
  deleteproject,
);
export default router;
