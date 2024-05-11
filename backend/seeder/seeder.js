import mongoose from 'mongoose';
import Product from '../models/product.js';
import products from './data.js';

const seedProducts = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/E-COM');

        // Delete existing products
        await Product.deleteMany();
        console.log('Products are deleted');

        // Log the data before insertion
        console.log('Inserting products:', products);

        // Insert new products
        await Product.insertMany(products);
        console.log('Products are added');

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');

        // Exit the process
        process.exit();
    } catch (error) {
        // Check for validation errors
        if (error.name === 'ValidationError') {
            console.error('Validation Errors:', error.errors);
        } else {
            console.error('Error:', error.message);
        }

        // Disconnect from MongoDB on error
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB due to error');

        // Exit the process with a non-zero code to indicate an error
        process.exit(1);
    }
};

// Run the seeder function
seedProducts();
