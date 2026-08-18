import WorkspaceMember from '../../models/workspaceMembers.js';

export const authorize = (...roles) => {
  return async (req, res, next) => {
    const member = await WorkspaceMember.findOne({
      userId: req.user._id,
      workspaceId: req.params.workspaceId,
    });

    if (!member) {
      const error = new Error('Unauthorized');
      error.status = 401;
      throw error;
    }

    if (!roles.includes(member.role)) {
      const error = new Error('Access Denied');
      error.status = 403;
      throw error;
    }

    next();
  };
};
