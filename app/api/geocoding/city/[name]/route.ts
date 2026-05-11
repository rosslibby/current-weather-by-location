import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY as string;
const BASE_URL = process.env.OPENWEATHER_BASE_URL as string;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const cityName = decodeURIComponent((await params)?.name || '');

    if (!cityName) {
      throw new Error('No city name was specified!');
    }

    const searchParams = new URLSearchParams({
      q: cityName,
      appid: API_KEY,
    });
    const result = await fetch(`${BASE_URL}/geo/1.0/direct?${searchParams}`)
      .then((res) => res.json())
      .catch((error) => ({
        error,
      }));

    if (result.error) {
      throw new Error(result.error);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('There was an error finding the lat/lon for the requested city:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
