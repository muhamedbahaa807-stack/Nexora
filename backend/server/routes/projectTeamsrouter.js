import { Router } from 'express';
import { verifyAccessToken } from '../middlewares/verifyaccesstoken.js';
import { checkSchema } from 'express-validator';
import { projectTeamsValidation } from '../utils/validations.js';
import { authorize } from '../middlewares/authorize.js';
import {
  addProjectTeam,
  getProjectTeams,
  removeProjectTeam,
} from '../controllers/projectTeamscontroller.js';
const router = Router();
router.post(
  '/workspaces/:workspaceId/projects/:projectId/teams',
  verifyAccessToken,
  authorize('admin', 'owner'),
  checkSchema(projectTeamsValidation),
  addProjectTeam,
);
router.get(
  '/workspaces/:workspaceId/projects/:projectId/teams',
  verifyAccessToken,
  getProjectTeams,
);
router.delete(
  '/workspaces/:workspaceId/projects/:projectId/teams/:teamId',
  verifyAccessToken,
  authorize('admin', 'owner'),
  removeProjectTeam,
);
export default router;
