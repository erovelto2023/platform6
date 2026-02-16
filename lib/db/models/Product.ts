import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    businessId: string;
    name: string;
    description?: string;
    price: number;
    type: 'service' | 'product';
    sku?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema(
    {
        businessId: {
            type: String,
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        type: {
            type: String,
            enum: ['service', 'product'],
            default: 'service',
        },
        sku: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
