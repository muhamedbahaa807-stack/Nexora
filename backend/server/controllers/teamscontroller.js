import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import WorkspaceMember from '../../models/workspaceMembers.js';
import Team from '../../models/teams.js';

export const addTeam = async (req, res) => {
  const result = validationResult(req);

  const { workspaceId } = req.params;
  const { name, description, leaderId } = req.body;

  if (!result.isEmpty()) {
    const error = new Error(result.array()[0].msg);
    error.status = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    const error = new Error('Invalid workspace id');
    error.status = 400;
    throw error;
  }

  const creator = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId,
  });

  if (!creator) {
    const error = new Error('You are not a member in this workspace');
    error.status = 403;
    throw error;
  }

  const leader = await WorkspaceMember.findOne({
    userId: leaderId,
    workspaceId,
  });

  if (!leader) {
    const error = new Error('Team leader is not a member of this workspace');
    error.status = 400;
    throw error;
  }
  if (leader.role === 'guest') {
    const error = new Error('Guest cannot be a team leader');
    error.status = 400;
    throw error;
  }
  await Team.create({
    name,
    description,
    workspaceId,
    leaderId,
    createdBy: req.user._id,
  });

  res.status(201).json({
    message: 'Team created',
  });
};
export const getTeams = async (req, res) => {
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

  const teams = await Team.find({ workspaceId })
    .populate('leaderId', 'name email')
    .populate('createdBy', 'name email');

  res.status(200).json({
    teams,
  });
};
export const getTeam = async (req, res) => {
  const { workspaceId, teamId } = req.params;

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

  const isMember = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId,
  });

  if (!isMember) {
    const error = new Error('You are not a member of this workspace');
    error.status = 403;
    throw error;
  }

  const team = await Team.findOne({
    _id: teamId,
    workspaceId,
  })
    .populate('leaderId', 'name email phone')
    .populate('workspaceId', 'name slug');

  if (!team) {
    const error = new Error('Team not found in this workspace');
    error.status = 404;
    throw error;
  }

  res.status(200).json({ team });
};
export const updateTeam = async (req, res) => {
  const result = validationResult();
  const { workspaceId, teamId } = req.params;
  const { name, description } = req.body;
  if (!result.isEmpty()) {
    const error = new Error(result.array()[0].msg);
    error.status = 400;
    throw error;
  }
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

  const team = await Team.findOne({
    _id: teamId,
    workspaceId,
  });

  if (!team) {
    const error = new Error('Team not found in this workspace');
    error.status = 404;
    throw error;
  }

  if (name !== undefined) {
    team.name = name;
  }

  if (description !== undefined) {
    team.description = description;
  }

  await team.save();

  res.status(200).json({
    message: 'Team updated successfully',
    team,
  });
};
export const deleteTeam = async (req, res) => {
  const { workspaceId, teamId } = req.params;

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

  const team = await Team.findOne({
    _id: teamId,
    workspaceId,
  });

  if (!team) {
    const error = new Error('Team not found in this workspace');
    error.status = 404;
    throw error;
  }

  await Team.findByIdAndDelete(teamId);

  res.status(200).json({
    message: 'Team deleted successfully',
  });
};
