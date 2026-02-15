import { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
    senderId: { type: String, required: true }, // Clerk ID
    senderName: { type: String, required: true },
    senderAvatar: { type: String },
    content: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const TicketSchema = new Schema({
    clerkId: { type: String, required: true, index: true }, // Clerk ID of the creator
    userInfo: {
        firstName: { type: String },
        lastName: { type: String },
        email: { type: String },
        avatar: { type: String },
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Closed'],
        default: 'Open',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    messages: [MessageSchema],
}, { timestamps: true });

const Ticket = models.Ticket || model('Ticket', TicketSchema);

export default Ticket;
