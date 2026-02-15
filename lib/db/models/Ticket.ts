import { Schema, model, models } from 'mongoose';

const TicketSchema = new Schema({
    clerkId: {
        type: String,
        required: true,
        index: true
    },
    userInfo: {
        name: { type: String },
        email: { type: String },
        avatar: { type: String },
    },
    product: {
        type: String,
        required: [true, 'Please select a product'],
        enum: ['iPhone', 'Macbook Pro', 'iMac', 'iPad'],
    },
    description: {
        type: String,
        required: [true, 'Please enter a description of the issue'],
    },
    status: {
        type: String,
        enum: ['new', 'open', 'closed'],
        default: 'new',
    },
}, {
    timestamps: true,
});

const Ticket = models.Ticket || model('Ticket', TicketSchema);

export default Ticket;
