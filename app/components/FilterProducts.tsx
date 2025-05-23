'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';

const FilterProducts = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');
	const debouncedSearchValue = useDebounce(searchValue, 500); // 500ms delay

	// Update URL when debounced value changes
	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());
		if (debouncedSearchValue) {
			params.set('q', debouncedSearchValue);
		} else {
			params.delete('q');
		}
		router.push(`/?${params.toString()}`);
	}, [debouncedSearchValue, router, searchParams]);

	const handleAvailability = (value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (value !== 'all') {
			params.set('availability', value);
		} else {
			params.delete('availability');
		}
		router.push(`/?${params.toString()}`);
	};

	const handlePriceSort = (value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (value !== 'none') {
			params.set('sort', value);
		} else {
			params.delete('sort');
		}
		router.push(`/?${params.toString()}`);
	};

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
			<div className='flex items-center gap-2'>
				<Input
					placeholder='Search products...'
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
				/>
				<Select
					value={searchParams.get('availability') || 'all'}
					onValueChange={handleAvailability}
				>
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
				<Select
					value={searchParams.get('sort') || 'none'}
					onValueChange={handlePriceSort}
				>
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
	);
};

export default FilterProducts;
