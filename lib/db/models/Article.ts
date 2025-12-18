import { Schema, model, models } from 'mongoose';

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    category: {
        type: String,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Article = models.Article || model('Article', ArticleSchema);

export default Article;
