import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
    name: string;
    description: string;
    price: number;
    category: 'electronics' | 'clothing' | 'books' | 'home' | 'sports' | 'other';
    inStock: boolean;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        maxlength: [100, 'Name cannot be more than 100 characters'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: [500, 'Description cannot be more than 500 characters'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: [0, 'Price cannot be negative'],
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: {
            values: ['electronics', 'clothing', 'books', 'home', 'sports', 'other'],
            message: 'Please select a valid category'
        },
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    imageUrl: {
        type: String,
        default: '',
        trim: true,
    },
}, {
    timestamps: true,
});

// Prevent re-compilation during development
export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);