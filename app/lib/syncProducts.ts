import { parseString } from 'xml2js';
import { promisify } from 'util';
import Product from '../models/Product';
import connectDB from './db';

const parseXml = promisify(parseString);

interface ProductData {
	id: string;
	title: string;
	link: string;
	image_link: string;
	price: {
		amount: number;
		currency: string;
	};
	availability: string;
}

export async function syncProducts() {
	try {
		await connectDB();

		// Fetch the XML feed
		const response = await fetch(
			'https://cevoid-dev-storage.b-cdn.net/cevoid-product-feed.xml'
		);
		const xmlData = await response.text();

		// Parse XML to JSON
		const result: any = await parseXml(xmlData);
		const products = result.rss.channel[0].item;

		// Transform products to match our schema
		const transformedProducts: ProductData[] = products.map((product: any) => {
			const priceStr = product['ns0:price'][0];
			const [amount, currency] = priceStr.split(' ');

			return {
				id: product['ns0:id'][0],
				title: product.title[0],
				link: product.link[0],
				image_link: product['ns0:image_link'][0],
				price: {
					amount: parseFloat(amount),
					currency: currency || 'USD',
				},
				availability: product['ns0:availability'][0],
			};
		});
		// Get all existing product IDs
		const existingProducts = await Product.find({}, 'id');
		const existingIds = new Set(existingProducts.map((p) => p.id));

		// Get all new product IDs
		const newIds = new Set(transformedProducts.map((p) => p.id));

		// Find products to delete (exist in DB but not in feed)
		const productsToDelete = Array.from(existingIds).filter(
			(id) => !newIds.has(id)
		);

		// Delete products no longer in feed
		if (productsToDelete.length > 0) {
			await Product.deleteMany({ id: { $in: productsToDelete } });
		}

		// Update or insert products
		const bulkOps = transformedProducts.map((product) => ({
			updateOne: {
				filter: { id: product.id },
				update: { $set: product },
				upsert: true,
			},
		}));

		if (bulkOps.length > 0) {
			await Product.bulkWrite(bulkOps);
		}

		return {
			success: true,
			message: `Sync completed. Updated/Inserted: ${transformedProducts.length}, Deleted: ${productsToDelete.length}`,
		};
	} catch (error) {
		console.error('Error syncing products:', error);
		return {
			success: false,
			message: 'Error syncing products',
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}
