import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY as string;
const BASE_URL = process.env.OPENWEATHER_BASE_URL as string;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ zip: string }> },
) {
  try {
    const { zip: postalCode } = await params;

    if (!postalCode) {
      throw new Error('No zip code was specified!');
    }

    const searchParams = new URLSearchParams({
      zip: postalCode,
      appid: API_KEY,
    });
    const result = await fetch(`${BASE_URL}/geo/1.0/zip?${searchParams}`)
      .then((res) => res.json())
      .catch((error) => ({
        error,
      }));

    if (result.error) {
      throw new Error(result.error);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('There was an error finding the lat/lon for the requested zip code:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
