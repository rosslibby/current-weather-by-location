import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY as string;
const BASE_URL = process.env.OPENWEATHER_BASE_URL as string;

export async function GET(
  req: NextRequest,
) {
  try {
    const params = req.nextUrl.searchParams;
    console.log(`[forecast:params]`, params);
    const latitude = params.get('latitude') as string;
    const longitude = params.get('longitude') as string;

    if (!latitude || !longitude) {
      throw new Error('Must specify latitude and longitude!');
    }

    const searchParams = new URLSearchParams({
      lat: latitude,
      lon: longitude,
      units: 'imperial',
      appid: API_KEY,
    });
    console.log(`[forecast:url]`, `${BASE_URL}/data/2.5/weather?${searchParams}`)
    const result = await fetch(`${BASE_URL}/data/2.5/weather?${searchParams}`)
      .then((res) => res.json())
      .catch((error) => ({
        error,
      }));

    console.log(`[forecast:result]`, result);
    if (result.error) {
      console.error(`[forecast:res.error]`, result.error);
      throw new Error(result.error);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('There was an error finding the lat/lon for the requested city:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
