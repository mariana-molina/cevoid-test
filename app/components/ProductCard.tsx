import Image from 'next/image';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';

interface ProductCardProps {
	product: {
		id: string;
		title: string;
		link: string;
		image_link: string;
		price: string;
		availability: string;
	};
}

export function ProductCard({ product }: ProductCardProps) {
	return (
		<Card className='w-full max-w-sm hover:shadow-lg transition-shadow'>
			<CardHeader className='relative h-48'>
				<Image
					src={product.image_link}
					alt={product.title}
					fill
					className='object-contain'
				/>
			</CardHeader>
			<CardContent>
				<h3 className='font-semibold text-lg mb-2 line-clamp-2'>
					{product.title}
				</h3>
				<p className='text-xl font-bold text-primary mb-2'>{product.price}</p>
				<p
					className={`text-sm ${
						product.availability === 'in stock'
							? 'text-green-600'
							: 'text-red-600'
					}`}
				>
					{product.availability}
				</p>
			</CardContent>
			<CardFooter>
				<a
					href={product.link}
					target='_blank'
					rel='noopener noreferrer'
					className='w-full text-center py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors'
				>
					View Product
				</a>
			</CardFooter>
		</Card>
	);
}
