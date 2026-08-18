import mongoose from 'mongoose';

const invitationschema = mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'workspaces',
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
    enum: ['admin', 'project_manager', 'team_member', 'guest'],
  },

  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'workspacemember',
    required: true,
  },

  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 1000 * 60 * 60 * 24),
  },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'expired', 'revoked'],
    default: 'pending',
  },
});

const WorkSpaceInvitation = mongoose.model(
  'workspaceinvitation',
  invitationschema,
);

export default WorkSpaceInvitation;
