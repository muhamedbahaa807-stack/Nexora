import { Router } from 'express';
import { verifyAccessToken } from '../middlewares/verifyaccesstoken.js';
import {
  addTeamMember,
  changeTeamLeader,
  getTeamMembers,
  removeTeamMember,
} from '../controllers/teamMemberscontroller.js';
import { authorize } from '../middlewares/authorize.js';
const router = Router();
router.post(
  '/workspaces/:workspaceId/teams/:teamId/members',
  verifyAccessToken,
  authorize('owner', 'admin'),
  addTeamMember,
);
router.get(
  '/workspaces/:workspaceId/teams/:teamId/members',
  verifyAccessToken,
  getTeamMembers,
);
router.delete(
  '/workspaces/:workspaceId/teams/:teamId/members/:memberId',
  verifyAccessToken,
  authorize('owner', 'admin'),
  removeTeamMember,
);
router.patch(
  '/workspaces/:workspaceId/teams/:teamId/leader',
  verifyAccessToken,
  authorize('owner', 'admin'),
  changeTeamLeader,
);
export default router;
