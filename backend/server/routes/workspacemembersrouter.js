import { Router } from 'express';
import { verifyAccessToken } from '../middlewares/verifyaccesstoken.js';
import {
  sendInvite,
  getInvitations,
  respondToInvitation,
  getWorkspaceMembers,
  getWorkspaceMember,
  updatemember,
  removeMember,
} from '../controllers/workspacemembers.js';
import { authorize } from '../middlewares/authorize.js';
const router = Router();
router.post(
  '/api/workspaces/:workspaceId/invitations',
  verifyAccessToken,
  sendInvite,
);
router.get('/api/invitations', verifyAccessToken, getInvitations);
router.patch(
  '/api/invitations/:invitationId',
  verifyAccessToken,
  respondToInvitation,
);
router.get(
  '/api/workspaces/:workspaceId/members',
  verifyAccessToken,
  getWorkspaceMembers,
);
router.get(
  '/api/workspaces/:workspaceId/members/:memberId',
  verifyAccessToken,
  getWorkspaceMember,
);
router.patch(
  '/api/workspaces/:workspaceId/members/:memberId',
  verifyAccessToken,
  authorize('admin', 'owner'),
  updatemember,
);
router.delete(
  '/api/workspaces/:workspaceId/members/:memberId',
  verifyAccessToken,
  removeMember,
);
export default router;
