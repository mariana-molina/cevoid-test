import { NextResponse } from 'next/server';
import { syncProducts } from '../../lib/syncProducts';

export async function POST() {
	try {
		const result = await syncProducts();
		return NextResponse.json(result);
	} catch (error) {
		console.error('Error syncing products:', error);
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
