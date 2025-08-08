import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { getCurrentUserFromRequest } from '@/lib/jwt';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const user = getCurrentUserFromRequest(request);

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Connect MongoDB
        await dbConnect();
        console.log('🗃️ Connected to MongoDB for products');

        // Test products
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            console.log('📦 Creating sample products in MongoDB...');

            await Product.insertMany([
                {
                    name: 'MacBook Pro M3',
                    description: 'Apple MacBook Pro 14-inch with M3 chip, 16GB RAM, 512GB SSD',
                    price: 2499,
                    category: 'electronics',
                    inStock: true,
                },
                {
                    name: 'Nike Air Max 270',
                    description: 'Comfortable running shoes with air cushioning',
                    price: 129.99,
                    category: 'sports',
                    inStock: true,
                },
                {
                    name: 'JavaScript: The Definitive Guide',
                    description: 'Complete guide to JavaScript programming - 7th Edition',
                    price: 59.99,
                    category: 'books',
                    inStock: false,
                },
                {
                    name: 'Organic Cotton T-Shirt',
                    description: 'Comfortable organic cotton t-shirt, available in multiple colors',
                    price: 24.99,
                    category: 'clothing',
                    inStock: true,
                },
                {
                    name: 'Breville Coffee Maker',
                    description: 'Automatic drip coffee maker with programmable timer',
                    price: 199.99,
                    category: 'home',
                    inStock: true,
                },
                {
                    name: 'Samsung Galaxy S24',
                    description: 'Latest Samsung smartphone with advanced camera system',
                    price: 899,
                    category: 'electronics',
                    inStock: true,
                },
                {
                    name: 'Adidas Running Shoes',
                    description: 'Lightweight running shoes with boost technology',
                    price: 149.99,
                    category: 'sports',
                    inStock: false,
                },
                {
                    name: 'React Cookbook',
                    description: 'Advanced React patterns and techniques for modern web development',
                    price: 45.99,
                    category: 'books',
                    inStock: true,
                },
            ]);

        }

        const products = await Product.find().sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            products,
            total: products.length
        });
    } catch (error) {
        console.error('Products fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}