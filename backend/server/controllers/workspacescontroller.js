import { validationResult } from 'express-validator';
import Workspace from '../../models/workspaces.js';
import WorkspaceMember from '../../models/workspaceMembers.js';
import mongoose from 'mongoose';
//Add a workspace (post to '/api/workspace')
export const addworkspace = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error = new Error(result.array()[0].msg);
    error.status = 400;
    throw error;
  }
  const { name, slug, logo } = req.body;
  const isSlugExist = await Workspace.findOne({ slug });
  if (isSlugExist) {
    const error = new Error('slug has been used');
    error.status = 409;
    throw error;
  }
  const newWorkSpace = await Workspace.create({
    name,
    slug,
    logo,
    createdBy: req.user._id,
  });
  await WorkspaceMember.create({
    userId: req.user._id,
    workspaceId: newWorkSpace._id,
    role: 'owner',
  });
  res.status(201).json({ message: 'workSpace has been created', newWorkSpace });
};
//GETMYWORKSPACES (get to '/api/workspaces')
export const getmyworkspaces = async (req, res) => {
  const myWS = await WorkspaceMember.find({
    userId: req.user._id,
  })
    .select('workspaceId')
    .populate('workspaceId');
  res.status(200).json(myWS);
};
//GETSPECIFICWS (get to '/api/workspace/:id')
export const getworkspace = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('invalid id');
    error.status = 400;
    throw error;
  }
  const WS = await WorkspaceMember.findOne({
    userId: req.user._id,
    workspaceId: id,
  })
    .select('workspaceId role')
    .populate('workspaceId');
  if (!WS) {
    const error = new Error('You are not member in this WorkSpace');
    error.status = 403;
    throw error;
  }
  res.status(200).json({
    workspace: WS.workspaceId,
    role: WS.role,
  });
};
//UPDATEWS (patch to '/api/workspace/:id')
export const updateWS = async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('invalid id');
    error.status = 400;
    throw error;
  }

  const WS = await Workspace.findById(id);

  if (!WS) {
    const error = new Error('WorkSpace not found');
    error.status = 404;
    throw error;
  }

  const updatedWS = await Workspace.findByIdAndUpdate(id, body, { new: true });

  res.status(200).json({
    message: 'WorkSpace updated',
    workspace: updatedWS,
  });
};

export const deleteWS = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('invalid id');
    error.status = 400;
    throw error;
  }

  const WS = await Workspace.findByIdAndDelete(id);

  if (!WS) {
    const error = new Error('WorkSpace not found');
    error.status = 404;
    throw error;
  }

  await WorkspaceMember.deleteMany({
    workspaceId: id,
  });

  res.status(200).json({
    message: 'WorkSpace deleted',
  });
};
