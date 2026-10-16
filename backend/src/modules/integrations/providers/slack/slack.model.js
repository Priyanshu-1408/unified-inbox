import mongoose from 'mongoose';

const slackSchema = new mongoose.Schema({
teamId: { type: String, required: true, unique: true },
teamName: String,
userId: String,
accessToken: { type: String, required: true },
scope: String,
});

export default mongoose.model('SlackAccount', slackSchema);
