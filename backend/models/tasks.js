import mongoose from 'mongoose';

const tasksSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Projects',
      required: true,
    },

    responsibleTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teams',
      required: true,
    },

    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },

    priority: {
      type: String,
      required: true,
      enum: ['high', 'medium', 'a bit'],
    },

    status: {
      type: String,
      enum: ['todo', 'in-progress', 'ready-for-review', 'completed'],
      default: 'todo',
    },
  },
  {
    timestamps: true,
  },
);

const Task = mongoose.model('Tasks', tasksSchema);
export default Task;
