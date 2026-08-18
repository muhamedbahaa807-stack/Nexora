import mongoose from 'mongoose';
const workspacememberschema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'workspaces',
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member', 'guest'],
    },
  },
  {
    timestamps: true,
  },
);
const WorkspaceMember = mongoose.model(
  'workspacemember',
  workspacememberschema,
);
export default WorkspaceMember;
