import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../lib/db';
import Product from '../../models/Product';

interface ProductFilter {
	$text?: { $search: string };
	availability?: string;
	'price.amount'?: {
		$gte?: number;
		$lte?: number;
	};
}

export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const searchParams = request.nextUrl.searchParams;
		const query = searchParams.get('q') || '';
		const availability = searchParams.get('availability');
		const minPrice = searchParams.get('minPrice');
		const maxPrice = searchParams.get('maxPrice');
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '10');

		// Build the filter object
		const filter: ProductFilter = {};

		if (query) {
			filter.$text = { $search: query };
		}

		if (availability && availability !== 'all') {
			filter.availability = availability;
		}

		if (minPrice || maxPrice) {
			filter['price.amount'] = {};
			if (minPrice) {
				filter['price.amount'].$gte = parseFloat(minPrice);
			}
			if (maxPrice) {
				filter['price.amount'].$lte = parseFloat(maxPrice);
			}
		}

		// Calculate skip value for pagination
		const skip = (page - 1) * limit;

		// Execute query with pagination
		const [products, total] = await Promise.all([
			Product.find(filter)
				.sort(query ? { score: { $meta: 'textScore' } } : {})
				.skip(skip)
				.limit(limit),
			Product.countDocuments(filter),
		]);

		return NextResponse.json({
			products,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error('Error searching products:', error);
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
