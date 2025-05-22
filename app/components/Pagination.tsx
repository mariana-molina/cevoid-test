'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface ProductPaginationProps {
	currentPage: number;
	totalPages: number;
}

const Pagination = ({ currentPage, totalPages }: ProductPaginationProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());
		router.push(`/?${params.toString()}`);
	};

	if (totalPages <= 1) return null;

	return (
		<div className='flex justify-center gap-2 mt-8'>
			<Button
				variant='outline'
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				Previous
			</Button>
			<span className='py-2 px-4'>
				Page {currentPage} of {totalPages}
			</span>
			<Button
				variant='outline'
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				Next
			</Button>
		</div>
	);
};

export default Pagination;
