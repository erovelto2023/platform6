import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    businessId: mongoose.Types.ObjectId;
    name: string;
    type: 'income' | 'expense';
    color?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
    {
        businessId: {
            type: Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['income', 'expense'],
            required: true,
        },
        color: {
            type: String,
            default: '#3b82f6',
        },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
