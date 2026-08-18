import { Router } from 'express';
import { verifyAccessToken } from '../middlewares/verifyaccesstoken.js';
import {
  taskValidation,
  updateProjectValidation,
  updateTaskStatusValidation,
} from '../utils/validations.js';
import {
  addTask,
  getTasks,
  updateTask,
  updateTaskStatus,
} from '../controllers/taskscontroller.js';
import { checkSchema } from 'express-validator';
import { authorize } from '../middlewares/authorize.js';
const router = Router();
router.post(
  '/workspaces/:workspaceId/projects/:projectId/tasks',
  verifyAccessToken,
  checkSchema(taskValidation),
  addTask,
);
router.get(
  '/workspaces/:workspaceId/:teamId/projects/:projectId/tasks',
  verifyAccessToken,
  getTasks,
);
router.patch(
  '/workspaces/:workspaceId/projects/:projectId/:taskId',
  verifyAccessToken,
  authorize('admin', 'owner'),
  checkSchema(updateProjectValidation),
  updateTask,
);
router.patch(
  '/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/status',
  verifyAccessToken,
  checkSchema(updateTaskStatusValidation),
  updateTaskStatus,
);
export default router;
