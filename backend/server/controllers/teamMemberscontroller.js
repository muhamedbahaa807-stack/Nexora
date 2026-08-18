import mongoose from 'mongoose';
import WorkspaceMember from '../../models/workspaceMembers.js';
import Team from '../../models/teams.js';
import teamMembers from '../../models/teamMembers.js';

export const addTeamMember = async (req, res) => {
  const { workspaceId, teamId } = req.params;
  const { userId } = req.body;

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

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error('Invalid userId');
    error.status = 400;
    throw error;
  }

  const member = await WorkspaceMember.findOne({
    userId,
    workspaceId,
  });

  if (!member) {
    const error = new Error('Member not in this workspace');
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

  const alreadyMember = await teamMembers.findOne({
    teamId,
    userId,
  });

  if (alreadyMember) {
    const error = new Error('User already in this team');
    error.status = 409;
    throw error;
  }

  await teamMembers.create({
    teamId,
    userId,
  });

  res.status(201).json({
    message: 'Team member added',
  });
};
export const getTeamMembers = async (req, res) => {
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

  const member = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId,
  });

  if (!member) {
    const error = new Error('You are not a member of this workspace');
    error.status = 403;
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

  const members = await TeamMember.find({ teamId }).populate(
    'userId',
    'name email phone',
  );

  res.status(200).json({
    members,
  });
};
export const removeTeamMember = async (req, res) => {
  const { workspaceId, teamId, memberId } = req.params;

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

  if (!mongoose.Types.ObjectId.isValid(memberId)) {
    const error = new Error('Invalid member id');
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

  const teamMember = await TeamMember.findOne({
    _id: memberId,
    teamId,
  });

  if (!teamMember) {
    const error = new Error('Member not found in this team');
    error.status = 404;
    throw error;
  }

  if (team.leaderId.toString() === teamMember.userId.toString()) {
    const error = new Error(
      'Team leader cannot be removed. Change the leader first.',
    );
    error.status = 403;
    throw error;
  }

  await TeamMember.findByIdAndDelete(memberId);

  res.status(200).json({
    message: 'Team member removed successfully',
  });
};
export const changeTeamLeader = async (req, res) => {
  const { workspaceId, teamId } = req.params;
  const { leaderId } = req.body;

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

  if (!mongoose.Types.ObjectId.isValid(leaderId)) {
    const error = new Error('Invalid leader id');
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

  const member = await WorkspaceMember.findOne({
    userId: leaderId,
    workspaceId,
  });

  if (!member) {
    const error = new Error('New leader is not a member of this workspace');
    error.status = 400;
    throw error;
  }

  const teamMember = await TeamMember.findOne({
    teamId,
    userId: leaderId,
  });

  if (!teamMember) {
    const error = new Error('New leader must be a member of this team');
    error.status = 400;
    throw error;
  }

  team.leaderId = leaderId;

  await team.save();

  res.status(200).json({
    message: 'Team leader changed successfully',
    team,
  });
};
