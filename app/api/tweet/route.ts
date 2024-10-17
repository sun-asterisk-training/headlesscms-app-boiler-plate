import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function POST(request: Request) {
  // console.log('API Key exists:', !!process.env.TWITTER_API_KEY);
  // console.log('API Secret exists:', !!process.env.TWITTER_API_SECRET);
  // console.log('Access Token exists:', !!process.env.TWITTER_ACCESS_TOKEN);
  // console.log('Access Secret exists:', !!process.env.TWITTER_ACCESS_SECRET);

  try {
    // console.log('Initializing Twitter client...');
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    // console.log('Twitter client initialized. Attempting to tweet...');
    const tweet = await client.v2.tweet('NILTOのコンテンツが更新されました(これはtestです)');
    // console.log('Tweet sent successfully:', tweet);

    return NextResponse.json({ message: 'Tweet sent successfully', tweet }, { status: 200 });
  } catch (error: any) {
    // console.error('Error sending tweet:', error.message);
    // console.error('Full error object:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: error.message, details: JSON.stringify(error, null, 2) },
      { status: 500 },
    );
  }
}
