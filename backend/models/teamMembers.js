import mongoose from 'mongoose';
const teamMemberschema = mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teams',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const teamMembers = mongoose.model('teamMembers', teamMemberschema);
export default teamMembers;
