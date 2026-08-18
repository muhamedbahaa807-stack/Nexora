import User from '../../models/users.js';
import WorkSpaceInvitation from '../../models/WorkspaceInvitation.js';
import WorkspaceMember from '../../models/workspaceMembers.js';
import mongoose from 'mongoose';
export const sendInvite = async (req, res) => {
  const { workspaceId } = req.params;
  const { userId, role } = req.body;

  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    const error = new Error('Invalid workspace id');
    error.status = 400;
    throw error;
  }

  const invitedUser = await User.findById(userId);

  if (!invitedUser) {
    const error = new Error('This user not found');
    error.status = 404;
    throw error;
  }

  const isAlreadyExist = await WorkspaceMember.findOne({
    userId,
    workspaceId,
  });

  if (isAlreadyExist) {
    const error = new Error('This user already in this workspace');
    error.status = 409;
    throw error;
  }

  const inviter = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId,
  });

  if (!inviter) {
    const error = new Error('You are not a member of this workspace');
    error.status = 403;
    throw error;
  }

  const newInvite = await WorkSpaceInvitation.create({
    workspaceId,
    userId: invitedUser._id,
    email: invitedUser.email,
    role,
    invitedBy: inviter._id,
    status: 'pending',
  });

  res.status(201).json({
    message: 'Invitation sent',
    invitation: newInvite,
  });
};
export const getInvitations = async (req, res) => {
  const invitations = await WorkSpaceInvitation.find({
    userId: req.user._id,
    status: 'pending',
  })
    .populate('workspaceId', 'name logo')
    .populate({
      path: 'invitedBy',
      populate: {
        path: 'userId',
        select: 'name email',
      },
    });

  res.status(200).json({ invitations });
};
export const respondToInvitation = async (req, res) => {
  const { invitationId } = req.params;
  const { status } = req.body;

  if (status !== 'accepted' && status !== 'rejected') {
    const error = new Error('Status not valid');
    error.status = 400;
    throw error;
  }

  const invitation = await WorkSpaceInvitation.findOne({
    _id: invitationId,
    userId: req.user._id,
    status: 'pending',
  });

  if (!invitation) {
    const error = new Error('Invitation not found');
    error.status = 404;
    throw error;
  }

  if (invitation.expiresAt < Date.now()) {
    invitation.status = 'expired';
    await invitation.save();

    const error = new Error('Invitation expired');
    error.status = 400;
    throw error;
  }

  if (status === 'accepted') {
    await WorkspaceMember.create({
      userId: req.user._id,
      workspaceId: invitation.workspaceId,
      role: invitation.role,
    });

    invitation.status = 'accepted';
    await invitation.save();

    return res.status(201).json({
      message: 'Added to workspace',
    });
  }

  if (status === 'rejected') {
    invitation.status = 'rejected';
    await invitation.save();

    return res.status(200).json({
      message: 'Invitation rejected successfully',
    });
  }
};
export const getWorkspaceMembers = async (req, res) => {
  const { workspaceId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    const error = new Error('Invalid workspace id');
    error.status = 400;
    throw error;
  }

  const currentMember = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId,
  });

  if (!currentMember) {
    const error = new Error('You are not a member of this workspace');
    error.status = 403;
    throw error;
  }

  const members = await WorkspaceMember.find({
    workspaceId,
  }).populate('userId', 'name email');

  res.status(200).json({ members });
};
export const getWorkspaceMember = async (req, res) => {
  const { workspaceId, memberId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    const error = new Error('Invalid workspace id');
    error.status = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(memberId)) {
    const error = new Error('Invalid member id');
    error.status = 400;
    throw error;
  }

  const currentMember = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId,
  });

  if (!currentMember) {
    const error = new Error('You are not a member of this workspace');
    error.status = 403;
    throw error;
  }

  const member = await WorkspaceMember.findOne({
    _id: memberId,
    workspaceId,
  }).populate('userId', 'name email');

  if (!member) {
    const error = new Error('Member not found');
    error.status = 404;
    throw error;
  }

  res.status(200).json({ member });
};
export const updatemember = async (req, res) => {
  const { workspaceId, memberId } = req.params;
  const { role } = req.body;

  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    const error = new Error('Invalid workspace id');
    error.status = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(memberId)) {
    const error = new Error('Invalid member id');
    error.status = 400;
    throw error;
  }

  const allowedRoles = ['admin', 'member', 'guest'];

  if (!allowedRoles.includes(role)) {
    const error = new Error('Invalid role');
    error.status = 400;
    throw error;
  }

  const member = await WorkspaceMember.findOne({
    _id: memberId,
    workspaceId,
  });

  if (!member) {
    const error = new Error('Member not found');
    error.status = 404;
    throw error;
  }

  if (member.role === 'owner') {
    const error = new Error('Can not change owner');
    error.status = 403;
    throw error;
  }

  member.role = role;

  await member.save();

  res.status(200).json({
    message: 'Member role updated successfully',
  });
};
export const removeMember = async (req, res) => {
  const { workspaceId, memberId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    const error = new Error('Invalid workspace id');
    error.status = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(memberId)) {
    const error = new Error('Invalid member id');
    error.status = 400;
    throw error;
  }

  const currentMember = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId,
  });

  if (!currentMember) {
    const error = new Error('You are not a member of this workspace');
    error.status = 403;
    throw error;
  }

  const member = await WorkspaceMember.findOne({
    _id: memberId,
    workspaceId,
  });

  if (!member) {
    const error = new Error('Member not found');
    error.status = 404;
    throw error;
  }

  if (member.role === 'owner') {
    const error = new Error('Owner cannot be removed');
    error.status = 403;
    throw error;
  }

  if (currentMember.role === 'member' || currentMember.role === 'guest') {
    if (currentMember._id.toString() !== memberId) {
      const error = new Error('You can only leave the workspace yourself');
      error.status = 403;
      throw error;
    }
  }

  await WorkspaceMember.findByIdAndDelete(memberId);

  res.status(200).json({
    message: 'Member removed from workspace successfully',
  });
};
