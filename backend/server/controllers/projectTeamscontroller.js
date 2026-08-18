import mongoose from 'mongoose';
import WorkspaceMember from '../../models/workspaceMembers.js';
import Project from '../../models/projects.js';
import Team from '../../models/teams.js';
import ProjectTeam from '../../models/projectTeam.js';
import { validationResult } from 'express-validator';

export const addProjectTeam = async (req, res) => {
  const { workspaceId, projectId } = req.params;
  const { teamId } = req.body;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error = new Error(result.array()[0].msg);
    error.status = 400;
    throw error;
  }
  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    const error = new Error('Invalid WorkSpace Id');
    error.status = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    const error = new Error('Invalid Project Id');
    error.status = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    const error = new Error('Invalid Team Id');
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
    const error = new Error('This project does not exist');
    error.status = 404;
    throw error;
  }

  const team = await Team.findOne({
    _id: teamId,
    workspaceId,
  });

  if (!team) {
    const error = new Error('This team does not exist in this workspace');
    error.status = 404;
    throw error;
  }

  const alreadyAdded = await ProjectTeam.findOne({
    projectId,
    teamId,
  });

  if (alreadyAdded) {
    const error = new Error('This team is already added to this project');
    error.status = 409;
    throw error;
  }

  await ProjectTeam.create({
    projectId,
    teamId,
    addedBy: req.user._id,
  });

  res.status(201).json({
    message: 'Team added to project successfully',
  });
};
export const getProjectTeams = async (req, res) => {
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
  });

  if (!project) {
    const error = new Error('This project does not exist in this workspace');
    error.status = 404;
    throw error;
  }

  const projectTeams = await ProjectTeam.find({
    projectId,
  }).populate('teamId', 'name description leaderId');

  res.status(200).json({
    teams: projectTeams.map((projectTeam) => projectTeam.teamId),
  });
};
export const removeProjectTeam = async (req, res) => {
  const { workspaceId, projectId, teamId } = req.params;

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

  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    const error = new Error('Invalid team id');
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
    _id: teamId,
    workspaceId,
  });

  if (!team) {
    const error = new Error('This team does not exist in this workspace');
    error.status = 404;
    throw error;
  }

  const projectTeam = await ProjectTeam.findOne({
    projectId,
    teamId,
  });

  if (!projectTeam) {
    const error = new Error('This team is not assigned to this project');
    error.status = 404;
    throw error;
  }

  await ProjectTeam.findByIdAndDelete(projectTeam._id);

  res.status(200).json({
    message: 'Team removed from project successfully',
  });
};
