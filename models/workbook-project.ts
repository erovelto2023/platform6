import mongoose from "mongoose";

const WorkbookProjectSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            default: "Untitled Project",
        },
        width: {
            type: Number,
            required: true,
            default: 816,
        },
        height: {
            type: Number,
            required: true,
            default: 1056,
        },
        currentPageIndex: {
            type: Number,
            default: 0,
        },
        marginsEnabled: {
            type: Boolean,
            default: true,
        },
        bleedEnabled: {
            type: Boolean,
            default: false,
        },
        pages: {
            type: Array,
            default: [],
        },
        thumbnail: {
            type: String, // Base64 or URL
        },
    },
    {
        timestamps: true,
    }
);

const WorkbookProject =
    mongoose.models.WorkbookProject ||
    mongoose.model("WorkbookProject", WorkbookProjectSchema);

export default WorkbookProject;
