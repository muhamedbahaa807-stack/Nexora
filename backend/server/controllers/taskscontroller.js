import mongoose from 'mongoose';
import WorkspaceMember from '../../models/workspaceMembers.js';
import Project from '../../models/projects.js';
import Team from '../../models/teams.js';
import ProjectTeam from '../../models/projectTeam.js';
import teamMembers from '../../models/teamMembers.js';
import Task from '../../models/tasks.js';
import { validationResult } from 'express-validator';

export const addTask = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const error = new Error(result.array()[0].msg);
    error.status = 400;
    throw error;
  }

  const { workspaceId, projectId } = req.params;

  const { title, description, responsibleTeamId, assigneeId, priority } =
    req.body;

  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    const error = new Error('Invalid workspace id');
    error.status = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    const error = new Error('Invalid project id');
    error.status = 400;
    throw error;
  }

  const member = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId,
  });

  if (!member) {
    const error = new Error('You are not a member of this workspace');
    error.status = 403;
    throw error;
  }

  const project = await Project.findOne({
    _id: projectId,
    workspaceId,
  });

  if (!project) {
    const error = new Error('This project does not exist in this workspace');
    error.status = 404;
    throw error;
  }

  const team = await Team.findOne({
    _id: responsibleTeamId,
    workspaceId,
  });

  if (!team) {
    const error = new Error(
      'Responsible team does not exist in this workspace',
    );
    error.status = 404;
    throw error;
  }

  const projectTeam = await ProjectTeam.findOne({
    projectId,
    teamId: responsibleTeamId,
  });

  if (!projectTeam) {
    const error = new Error('This team is not assigned to this project');
    error.status = 400;
    throw error;
  }

  const assignee = await WorkspaceMember.findOne({
    userId: assigneeId,
    workspaceId,
  });

  if (!assignee) {
    const error = new Error('Assignee is not a member of this workspace');
    error.status = 400;
    throw error;
  }

  const teamMember = await teamMembers.findOne({
    teamId: responsibleTeamId,
    userId: assigneeId,
  });

  if (!teamMember) {
    const error = new Error('Assignee is not a member of the responsible team');
    error.status = 400;
    throw error;
  }

  const task = await Task.create({
    title,
    description,
    projectId,
    responsibleTeamId,
    assigneeId,
    priority,
  });

  res.status(201).json({
    message: 'Task created successfully',
    task,
  });
};
export const getTasks = async (req, res) => {
  const { workspaceId, teamId, projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    const error = new Error('Invalid workspace id');
    error.status = 400;
    throw error;
  }
  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    const error = new Error('Invalid team id');
    error.status = 400;
    throw error;
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    const error = new Error('Invalid project id');
    error.status = 400;
    throw error;
  }
  const member = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId,
  });
  if (!member) {
    const error = new Error('You are not member in this workspace');
    error.status = 403;
    throw error;
  }
  const team = await Team.findOne({
    _id: teamId,
    workspaceId,
  });
  if (!team) {
    const error = new Error('This team is not in this work space');
    error.status = 404;
    throw error;
  }
  const project = await Project.findOne({
    _id: projectId,
    workspaceId,
  });
  if (!project) {
    const error = new Error('This project not found');
    error.status = 404;
    throw error;
  }
  const projectTeam = await ProjectTeam.findOne({
    projectId,
    teamId,
  });
  if (!projectTeam) {
    const error = new Error('This team does not have this project');
    error.status = 404;
    throw error;
  }
  const tasks = await Task.find({ projectId })
    .populate('projectId', 'name')
    .populate('responsibleTeamId', '_id name')
    .populate('assigneeId', '_id name');
  res.status(200).json(tasks);
};
export const updateTask = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const error = new Error(result.array()[0].msg);
    error.status = 400;
    throw error;
  }

  const { workspaceId, projectId, taskId } = req.params;
  const { body } = req;

  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    const error = new Error('Invalid workspace id');
    error.status = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    const error = new Error('Invalid project id');
    error.status = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    const error = new Error('Invalid task id');
    error.status = 400;
    throw error;
  }

  const project = await Project.findOne({
    _id: projectId,
    workspaceId,
  });

  if (!project) {
    const error = new Error('This project not found');
    error.status = 404;
    throw error;
  }

  const task = await Task.findOneAndUpdate(
    {
      _id: taskId,
      projectId,
    },
    body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!task) {
    const error = new Error('Task not found in this project');
    error.status = 404;
    throw error;
  }

  res.status(200).json({
    message: 'Updated successfully',
    task,
  });
};
export const updateTaskStatus = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const error = new Error(result.array()[0].msg);
    error.status = 400;
    throw error;
  }

  const { workspaceId, projectId, taskId } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    const error = new Error('Invalid workspace id');
    error.status = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    const error = new Error('Invalid project id');
    error.status = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    const error = new Error('Invalid task id');
    error.status = 400;
    throw error;
  }

  const member = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId,
  });

  if (!member) {
    const error = new Error('You are not member in this workspace');
    error.status = 403;
    throw error;
  }

  const project = await Project.findOne({
    _id: projectId,
    workspaceId,
  });

  if (!project) {
    const error = new Error('This project not found');
    error.status = 404;
    throw error;
  }

  const task = await Task.findOne({
    _id: taskId,
    projectId,
  }).populate('responsibleTeamId', 'leaderId');

  if (!task) {
    const error = new Error('This task not found');
    error.status = 404;
    throw error;
  }

  const currentStatus = task.status;

  if (currentStatus === 'todo' && status === 'in-progress') {
    if (
      task.responsibleTeamId.leaderId.toString() !== req.user._id.toString()
    ) {
      const error = new Error(
        'Only the team leader can move the task to in-progress',
      );
      error.status = 403;
      throw error;
    }
  } else if (currentStatus === 'in-progress' && status === 'ready-for-review') {
    if (task.assigneeId.toString() !== req.user._id.toString()) {
      const error = new Error(
        'Only the responsible member can submit the task for review',
      );
      error.status = 403;
      throw error;
    }
  } else if (currentStatus === 'ready-for-review' && status === 'completed') {
    if (
      task.responsibleTeamId.leaderId.toString() !== req.user._id.toString()
    ) {
      const error = new Error('Only the team leader can complete the task');
      error.status = 403;
      throw error;
    }
  } else {
    const error = new Error(
      `Invalid status transition from ${currentStatus} to ${status}`,
    );
    error.status = 400;
    throw error;
  }

  task.status = status;
  await task.save();

  res.status(200).json({
    message: 'Status updated successfully',
    task,
  });
};
