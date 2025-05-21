'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ProductCard } from './components/ProductCard';
import { Label } from '@/components/ui/label';

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

interface Pagination {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export default function Home() {
	const [searchQuery, setSearchQuery] = useState('');
	const [availability, setAvailability] = useState('all');
	const [priceSort, setPriceSort] = useState('none');
	const [products, setProducts] = useState<Product[]>([]);
	const [pagination, setPagination] = useState<Pagination>({
		total: 0,
		page: 1,
		limit: 10,
		totalPages: 0,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [isSyncing, setIsSyncing] = useState(false);

	const fetchProducts = async (page = 1) => {
		setIsLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: pagination.limit.toString(),
				...(searchQuery && { q: searchQuery }),
				...(availability && { availability }),
				...(priceSort !== 'none' && { sort: priceSort }),
			});

			const response = await fetch(`/api/products/?${params.toString()}`);
			const data = await response.json();

			setProducts(data.products);
			setPagination(data.pagination);
		} catch (error) {
			console.error('Error fetching products:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSync = async () => {
		setIsSyncing(true);
		try {
			const response = await fetch('/api/sync', { method: 'POST' });
			const data = await response.json();
			if (data.success) {
				fetchProducts();
			}
		} catch (error) {
			console.error('Error syncing products:', error);
		} finally {
			setIsSyncing(false);
		}
	};

	useEffect(() => {
		const debounceTimer = setTimeout(() => {
			fetchProducts(1);
		}, 300);

		return () => clearTimeout(debounceTimer);
	}, [searchQuery, availability, priceSort]);

	return (
		<main className='container mx-auto px-4 py-8'>
			<div className='flex justify-between items-center mb-8'>
				<h1 className='text-3xl font-bold'>Product Search</h1>
				<Button onClick={handleSync} disabled={isSyncing}>
					{isSyncing ? 'Syncing...' : 'Sync Products'}
				</Button>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
				<div className='flex items-center gap-2'>	
					<Input
						placeholder='Search products...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<Select value={availability} onValueChange={setAvailability}>
						<SelectTrigger>
							<SelectValue placeholder='Availability' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All</SelectItem>
							<SelectItem value='in stock'>In Stock</SelectItem>
							<SelectItem value='out of stock'>Out of Stock</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className='flex items-center gap-2'>
					<Label htmlFor='sort-by-price'>Sort by Price</Label>
					<Select value={priceSort} onValueChange={setPriceSort}>
						<SelectTrigger>
							<SelectValue placeholder='Sort by Price' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='none'>Clear</SelectItem>
							<SelectItem value='price_asc'>Low to High</SelectItem>
							<SelectItem value='price_desc'>High to Low</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{isLoading ? (
				<div className='text-center'>Loading...</div>
			) : (
				<>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
						{products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>

					{pagination.totalPages > 1 && (
						<div className='flex justify-center gap-2 mt-8'>
							<Button
								variant='outline'
								onClick={() => fetchProducts(pagination.page - 1)}
								disabled={pagination.page === 1}
							>
								Previous
							</Button>
							<span className='py-2 px-4'>
								Page {pagination.page} of {pagination.totalPages}
							</span>
							<Button
								variant='outline'
								onClick={() => fetchProducts(pagination.page + 1)}
								disabled={pagination.page === pagination.totalPages}
							>
								Next
							</Button>
						</div>
					)}
				</>
			)}
		</main>
	);
}
