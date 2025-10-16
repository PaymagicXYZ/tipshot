import { NextResponse } from 'next/server';
import { getRecentTips } from '@/lib/actions/tip';

export async function GET() {
  try {
    const data = await getRecentTips({ limit: 20 });
    return NextResponse.json(data);
  } catch (error: any) {
    return new NextResponse(error?.message || 'Failed to fetch recent tips', {
      status: 500,
    });
  }
}


