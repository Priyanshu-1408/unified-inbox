import mongoose from 'mongoose';

const gmailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  accessToken: String,
  refreshToken: String,
  expiryDate: Number,
  scope: String,
});

export default mongoose.model('GmailAccount', gmailSchema);