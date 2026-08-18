import mongoose from 'mongoose';

const projectTeamSchema = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Projects',
      required: true,
    },

    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teams',
      required: true,
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },

    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

projectTeamSchema.index({ projectId: 1, teamId: 1 }, { unique: true });

const ProjectTeam = mongoose.model('ProjectTeams', projectTeamSchema);

export default ProjectTeam;
