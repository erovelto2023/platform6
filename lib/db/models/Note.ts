import { Schema, model, models } from 'mongoose';

const NoteSchema = new Schema({
    ticketId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Ticket',
    },
    clerkId: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: [true, 'Please add some text'],
    },
    isStaff: {
        type: Boolean,
        default: false,
    },
    staffId: {
        type: String,
    },
}, {
    timestamps: true,
});

const Note = models.Note || model('Note', NoteSchema);

export default Note;
