import { NextResponse } from 'next/server';
import { cleanDB } from '../../lib/cleanDB';

export async function POST() {
	try {
		const result = await cleanDB();

		if (result.success) {
			return NextResponse.json(result);
		} else {
			return NextResponse.json(result, { status: 500 });
		}
	} catch (error) {
		console.error('Error in clean endpoint:', error);
		return NextResponse.json(
			{
				success: false,
				message: 'Internal server error',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
