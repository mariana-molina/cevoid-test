import { NextResponse } from 'next/server';
import { syncProducts } from '../../lib/syncProducts';

export async function POST() {
	try {
		const result = await syncProducts();
		console.log('result!!!!!!', result);
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
