import { Schema, model, models } from 'mongoose';

const CalendarEventSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
    },
    type: {
        type: String,
        enum: ['live', 'assignment', 'workshop', 'general'],
        default: 'general',
    }
}, { timestamps: true });

const CalendarEvent = models.CalendarEvent || model('CalendarEvent', CalendarEventSchema);

export default CalendarEvent;
