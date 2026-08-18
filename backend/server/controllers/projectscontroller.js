import mongoose from 'mongoose';
import Project from '../../models/projects.js';
import ProjectTeam from '../../models/projectTeam.js';
import { validationResult } from 'express-validator';
import WorkspaceMember from '../../models/workspaceMembers.js';

export const addproject = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const error = new Error(result.array()[0].msg);
    error.status = 400;
    throw error;
  }

  const { workspaceId } = req.params;
  const { name, description, status, startDate, dueDate } = req.body;

  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    const error = new Error('Invalid workspace id');
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

  if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
    const error = new Error('Due date cannot be before start date');
    error.status = 400;
    throw error;
  }

  const project = await Project.create({
    name,
    description,
    workspaceId,
    createdBy: req.user._id,
    status: status || 'planning',
    startDate: startDate || null,
    dueDate: dueDate || null,
  });

  res.status(201).json({
    message: 'Project created successfully',
    project,
  });
};
export const getprojects = async (req, res) => {
  const { workspaceId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    const error = new Error('Invalid workspace id');
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

  const projects = await Project.find({ workspaceId })
    .populate('createdBy', 'name email')
    .lean();

  const projectIds = projects.map((project) => project._id);

  const projectTeams = await ProjectTeam.find({
    projectId: { $in: projectIds },
  })
    .populate('teamId', 'name description leaderId')
    .lean();

  const projectsWithTeams = projects.map((project) => ({
    ...project,
    teams: projectTeams
      .filter(
        (projectTeam) =>
          projectTeam.projectId.toString() === project._id.toString(),
      )
      .map((projectTeam) => projectTeam.teamId),
  }));

  res.status(200).json({
    projects: projectsWithTeams,
  });
};
export const getproject = async (req, res) => {
  const { workspaceId, projectId } = req.params;

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
  })
    .populate('createdBy', 'name email')
    .lean();

  if (!project) {
    const error = new Error('Project not found in this workspace');
    error.status = 404;
    throw error;
  }

  const projectTeams = await ProjectTeam.find({
    projectId,
  })
    .populate('teamId', 'name description leaderId')
    .lean();

  project.teams = projectTeams.map((projectTeam) => projectTeam.teamId);

  res.status(200).json({
    project,
  });
};
export const updateproject = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const error = new Error(result.array()[0].msg);
    error.status = 400;
    throw error;
  }

  const { workspaceId, projectId } = req.params;

  const { name, description, status, startDate, dueDate } = req.body;

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

  const project = await Project.findOne({
    _id: projectId,
    workspaceId,
  });

  if (!project) {
    const error = new Error('Project not found in this workspace');
    error.status = 404;
    throw error;
  }

  if (name !== undefined) {
    project.name = name;
  }

  if (description !== undefined) {
    project.description = description;
  }

  if (status !== undefined) {
    project.status = status;
  }

  if (startDate !== undefined) {
    project.startDate = startDate;
  }

  if (dueDate !== undefined) {
    project.dueDate = dueDate;
  }

  if (
    project.startDate &&
    project.dueDate &&
    new Date(project.dueDate) < new Date(project.startDate)
  ) {
    const error = new Error('Due date cannot be before start date');
    error.status = 400;
    throw error;
  }

  await project.save();

  res.status(200).json({
    message: 'Project updated successfully',
    project,
  });
};
export const deleteproject = async (req, res) => {
  const { workspaceId, projectId } = req.params;

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

  const project = await Project.findOne({
    _id: projectId,
    workspaceId,
  });

  if (!project) {
    const error = new Error('Project not found in this workspace');
    error.status = 404;
    throw error;
  }

  await ProjectTeam.deleteMany({
    projectId,
  });

  await Project.findByIdAndDelete(projectId);

  res.status(200).json({
    message: 'Project deleted successfully',
  });
};
