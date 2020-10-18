import mongoose from 'mongoose';
const { Schema } = mongoose;

export type UserDocument = mongoose.Document & {
  username: string;
  email: string;
  password: string;
};

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      default: 'Guest',
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>('user', userSchema);
