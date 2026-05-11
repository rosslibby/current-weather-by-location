import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { Suggestion } from '@/types';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY as string;
const BASE_URL = process.env.GOOGLE_PLACES_BASE_URL as string;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ term: string }> },
) {
  const cookieStore = await cookies();
  const sessionTokenCookie = cookieStore.get('session_token');
  const sessionToken = sessionTokenCookie?.value || crypto.randomUUID();

  const sessionTokenPayload = {
    value: sessionToken,
    isNew: typeof sessionTokenCookie?.value === 'undefined',
  };

  if (!sessionTokenCookie) {
    console.log(`🍪 Assigning new session token: ${sessionToken}`);
    cookieStore.set('session_token', sessionToken, {
      httpOnly: true,
      secure: true,
      path: '/',
    });
  } else {
    console.log(`⚡️ Using existing session token: ${sessionTokenCookie.value}`);
  }

  try {
    const searchTerm = decodeURIComponent((await params)?.term || '');

    if (!searchTerm) {
      throw new Error('No search term was specified!');
    }

    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
    });
    const body = JSON.stringify({
      includedPrimaryTypes: ["(cities)"],
      includeQueryPredictions: true,
      input: searchTerm,
    });
    const res = await fetch(`${BASE_URL}/places:autocomplete`, {
      method: 'POST',
      headers,
      body,
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    return NextResponse.json({
      suggestions: data.suggestions ? parseSuggestions(data.suggestions) : [],
      sessionToken: sessionTokenPayload,
    }, { status: 200 });
  } catch (error) {
    console.error('There was an error getting autocomplete predictions for the requested search term:', error);
    return NextResponse.json({ error, sessionToken: sessionTokenPayload }, { status: 500 });
  }
}

function parseSuggestions(suggestions: Suggestion[]): string[] {
  return suggestions.map(({ placePrediction: { text } }) => text.text);
}
