import { Router } from 'express';
import { verifyAccessToken } from '../middlewares/verifyaccesstoken.js';
import { authorize } from '../middlewares/authorize.js';
import { checkSchema } from 'express-validator';
import { teamValidation, updateTeamSchema } from '../utils/validations.js';
import {
  addTeam,
  getTeams,
  getTeam,
  updateTeam,
  deleteTeam,
} from '../controllers/teamscontroller.js';
const router = Router();
router.post(
  '/workspaces/:workspaceId/teams',
  verifyAccessToken,
  authorize('admin', 'owner'),
  checkSchema(teamValidation),
  addTeam,
);
router.get('/workspaces/:workspaceId/teams', verifyAccessToken, getTeams);
router.get(
  '/workspaces/:workspaceId/teams/:teamId',
  verifyAccessToken,
  getTeam,
);
router.patch(
  '/workspaces/:workspaceId/teams/:teamId',
  verifyAccessToken,
  authorize('owner', 'admin'),
  checkSchema(updateTeamSchema),
  updateTeam,
);
router.delete(
  '/workspaces/:workspaceId/teams/:teamId',
  verifyAccessToken,
  authorize('owner', 'admin'),
  deleteTeam,
);
export default router;
