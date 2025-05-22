import { Suspense } from 'react';
import FilterProducts from './components/FilterProducts';
import Pagination from './components/Pagination';
import { ProductCard } from './components/ProductCard';
import { SyncButton } from './components/SyncButton';
import connectDB from './lib/db';
import Product from './models/Product';

interface PageProps {
	searchParams: {
		page?: string;
		q?: string;
		availability?: string;
		sort?: string;
	};
}
interface ProductFilter {
	$text?: { $search: string };
	availability?: string;
}
interface Product {
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

export default async function Home({ searchParams }: PageProps) {
	await connectDB();
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const query = params.q || '';
	const availability = params.availability || 'all';
	const sort = params.sort || 'none';
	const limit = 10;
	const skip = (page - 1) * limit;

	// Build the filter object
	const filter: ProductFilter = {};
	if (query) filter.$text = { $search: query };
	if (availability && availability !== 'all')
		filter.availability = availability;

	// Build sort object
	let sortOptions = {};
	if (sort === 'price_asc') sortOptions = { 'price.amount': 1 };
	else if (sort === 'price_desc') sortOptions = { 'price.amount': -1 };
	else if (query) sortOptions = { score: { $meta: 'textScore' } };

	// Execute query with pagination
	const [rawProducts, total] = await Promise.all([
		Product.find(filter).sort(sortOptions).skip(skip).limit(limit).lean(),
		Product.countDocuments(filter),
	]);

	// Transform MongoDB documents to match Product interface
	const products: Product[] = rawProducts.map((doc) => ({
		id: doc.id,
		title: doc.title,
		link: doc.link,
		image_link: doc.image_link,
		price: {
			amount: doc.price.amount,
			currency: doc.price.currency,
		},
		availability: doc.availability,
	}));

	const pagination = {
		total,
		page,
		limit,
		totalPages: Math.ceil(total / limit),
	};

	return (
		<main className='container mx-auto px-4 py-8'>
			<div className='flex justify-between items-center mb-8'>
				<h1 className='text-3xl font-bold'>Product Search</h1>
				<SyncButton />
			</div>

			<Suspense fallback={<div>Loading filters...</div>}>
				<FilterProducts />
			</Suspense>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
			{products.length === 0 && (
				<div className='text-center text-gray-500 mt-4'>No products found.</div>
			)}

			<Suspense fallback={<div>Loading pagination...</div>}>
				<Pagination
					currentPage={pagination.page}
					totalPages={pagination.totalPages}
				/>
			</Suspense>
		</main>
	);
}
