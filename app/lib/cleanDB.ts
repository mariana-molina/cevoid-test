import connectDB from './db';
import Product from '../models/Product';

export async function cleanDB() {
	try {
		await connectDB();

		// Delete all products
		await Product.deleteMany({});

		return {
			success: true,
			message: 'Database cleaned successfully',
		};
	} catch (error) {
		console.error('Error cleaning database:', error);
		return {
			success: false,
			message: 'Error cleaning database',
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}
