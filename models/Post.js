import mongoose from 'mongoose';


const PostSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },

    text: {
        type: String,
        required: true,
    },

    tags: {
        type: Array,
        default: [],
    },
    postImage: {
        type: Array,
        default: [],
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postComment: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            comment: String,
        }
    ],
    imageUrl: String,

}, {
    timestamps: true,
});

export default mongoose.model('Post', PostSchema);