import mongoose from "mongoose";

const toolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: "Settings"
    },
    gradient: {
        type: String,
        default: "from-slate-500 to-slate-700"
    },
    path: {
        type: String,
        required: true
    },
    isEnabled: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Tool = mongoose.models.Tool || mongoose.model("Tool", toolSchema);

export default Tool;
