import mongoose from 'mongoose';
export const dbConnenction = async () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Databases connected'))
    .catch((err) => console.log(`Error:${err}`));
};
