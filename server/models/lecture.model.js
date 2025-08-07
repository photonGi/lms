import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    lectureTitle: {
        type: String,
        required: true,
    },
    videoUrl: {type: String},
    publicId: {type: String},
    isPreviewFee: {type: Boolean},
}, {timestamps:true});

export const Lecture = mongoose.model("Lecture", lectureSchema);