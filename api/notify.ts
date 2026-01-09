export const config = {
  runtime: 'edge',
};

// Sopranos character definitions with publicly available avatar URLs
const CHARACTERS = [
  {
    name: 'Tony Soprano',
    username: 'Tony Soprano',
    avatar: 'https://upload.wikimedia.org/wikipedia/en/6/6c/Tony_Soprano.jpg',
    traits: 'mob boss, short-tempered, philosophical at times, uses Jersey slang, often references food and family',
    catchphrases: ['Whaddya gonna do?', 'End of story.', 'You know what I mean?', 'Forget about it'],
  },
  {
    name: 'Paulie Walnuts',
    username: 'Paulie Walnuts',
    avatar: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paulie_Gualtieri.jpg',
    traits: 'superstitious, germaphobic, loyal soldier, tells long stories, distinctive laugh (heh heh), paranoid',
    catchphrases: ['Heh heh', 'You hear what I said?', 'Word to the wise', 'Commendatori!'],
  },
  {
    name: 'Christopher Moltisanti',
    username: 'Christopher Moltisanti',
    avatar: 'https://upload.wikimedia.org/wikipedia/en/d/df/Christopher_Moltisanti.jpg',
    traits: 'aspiring screenwriter, impulsive, struggles with addiction, uses movie references, dramatic',
    catchphrases: ['The highway was jammed with broken heroes', 'I could be making movies', 'You ever feel like nothing good was ever gonna happen to you?'],
  },
  {
    name: 'Silvio Dante',
    username: 'Silvio Dante',
    avatar: 'https://upload.wikimedia.org/wikipedia/en/3/3b/TheSopranos-SilvioDante.jpg',
    traits: 'consigliere, runs the Bada Bing, does Michael Corleone impressions, cool-headed, loyal to Tony',
    catchphrases: ['Just when I thought I was out, they pull me back in', 'Our true enemy has yet to reveal himself'],
  },
  {
    name: 'Junior Soprano',
    username: 'Uncle Junior',
    avatar: 'https://upload.wikimedia.org/wikipedia/en/e/e5/The_Sopranos_Junior.jpg',
    traits: 'old school, bitter about respect, uses old Italian expressions, paranoid, sarcastic, health complaints',
    catchphrases: ['Your sister\'s cunt!', 'In my day...', 'I got no spleen, Gene!'],
  },
  {
    name: 'Bobby Baccalieri',
    username: 'Bobby Baccala',
    avatar: 'https://upload.wikimedia.org/wikipedia/en/9/95/Bobby_Baccalieri.jpg',
    traits: 'gentle giant, model train enthusiast, loyal, often hungry, kind-hearted for a mobster',
    catchphrases: ['To the victor, belongs the spoils', 'I never had the makings of a varsity athlete'],
  },
];

interface NotifyRequest {
  message: string;
  source?: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
}

// Get a random character
function getRandomCharacter() {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
}

// Call OpenRouter API to rewrite message in character's voice
async function rewriteInCharacterVoice(
  message: string,
  character: typeof CHARACTERS[0],
  source?: string,
  severity?: string
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    // Fallback: simple character-style wrapper if no API key
    const catchphrase = character.catchphrases[Math.floor(Math.random() * character.catchphrases.length)];
    return `${catchphrase} ${message}`;
  }

  const severityContext = severity ? `The severity is ${severity}, so adjust your tone accordingly (more urgent for critical/error).` : '';
  const sourceContext = source ? `This notification is from: ${source}.` : '';

  const prompt = `You are ${character.name} from The Sopranos TV series.
Character traits: ${character.traits}
Some catchphrases: ${character.catchphrases.join(', ')}

Rewrite the following notification message in ${character.name}'s distinctive voice and speaking style.
Keep it relatively brief (2-3 sentences max) but make it sound authentically like the character would say it.
${severityContext}
${sourceContext}

Original message: "${message}"

Respond with ONLY the rewritten message, nothing else.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://sopranos-as-a-service.vercel.app',
        'X-Title': 'Sopranos as a Service',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 256,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      // Fallback on error
      const catchphrase = character.catchphrases[Math.floor(Math.random() * character.catchphrases.length)];
      return `${catchphrase} ${message}`;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || message;
  } catch (error) {
    console.error('OpenRouter API exception:', error);
    const catchphrase = character.catchphrases[Math.floor(Math.random() * character.catchphrases.length)];
    return `${catchphrase} ${message}`;
  }
}

// Search Tenor for a Sopranos GIF
async function searchSopranosGif(character: typeof CHARACTERS[0], severity?: string): Promise<string | null> {
  // Public Tenor API key fallback (limited but works for basic usage)
  const apiKey = process.env.TENOR_API_KEY || 'AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ';

  // Build search query based on character and mood
  const moodMap: Record<string, string> = {
    critical: 'angry',
    error: 'frustrated',
    warning: 'concerned',
    info: '',
  };

  const mood = severity ? moodMap[severity] || '' : '';
  const firstName = character.name.split(' ')[0];
  const searchQuery = `sopranos ${firstName} ${mood}`.trim();

  try {
    const url = new URL('https://tenor.googleapis.com/v2/search');
    url.searchParams.set('q', searchQuery);
    url.searchParams.set('key', apiKey);
    url.searchParams.set('limit', '20');
    url.searchParams.set('media_filter', 'gif');
    url.searchParams.set('contentfilter', 'medium');

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error('Tenor API error:', await response.text());
      // Try a more generic search
      url.searchParams.set('q', 'sopranos');
      const fallbackResponse = await fetch(url.toString());
      if (!fallbackResponse.ok) return null;
      const fallbackData = await fallbackResponse.json();
      if (fallbackData.results?.length > 0) {
        const randomGif = fallbackData.results[Math.floor(Math.random() * fallbackData.results.length)];
        return randomGif.media_formats?.gif?.url || null;
      }
      return null;
    }

    const data = await response.json();

    if (data.results?.length > 0) {
      // Pick a random GIF from results for variety
      const randomGif = data.results[Math.floor(Math.random() * data.results.length)];
      return randomGif.media_formats?.gif?.url || null;
    }

    return null;
  } catch (error) {
    console.error('Tenor API exception:', error);
    return null;
  }
}

// Post to Discord webhook
async function postToDiscord(
  webhookUrl: string,
  character: typeof CHARACTERS[0],
  rewrittenMessage: string,
  gifUrl: string | null,
  originalMessage: string,
  source?: string,
  severity?: string
): Promise<Response> {
  // Color based on severity
  const colorMap: Record<string, number> = {
    critical: 0xFF0000, // Red
    error: 0xFF4444,    // Light red
    warning: 0xFFA500,  // Orange
    info: 0x00BFFF,     // Blue
  };
  const color = severity ? colorMap[severity] || 0x8B4513 : 0x8B4513; // Default: SaddleBrown (mob-like)

  const embed: Record<string, unknown> = {
    description: `**${rewrittenMessage}**`,
    color: color,
    footer: {
      text: source ? `Source: ${source}` : 'Sopranos as a Service',
    },
    timestamp: new Date().toISOString(),
  };

  // Add GIF as image if available
  if (gifUrl) {
    embed.image = { url: gifUrl };
  }

  const payload = {
    username: character.username,
    avatar_url: character.avatar,
    embeds: [embed],
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response;
}

// Main handler
export default async function handler(request: Request): Promise<Response> {
  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed. Use POST.' }),
      {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Get Discord webhook URL from header
  const webhookUrl = request.headers.get('x-saas-destination');
  if (!webhookUrl) {
    return new Response(
      JSON.stringify({ error: 'Missing x-saas-destination header with Discord webhook URL' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Validate webhook URL format
  if (!webhookUrl.startsWith('https://discord.com/api/webhooks/') &&
      !webhookUrl.startsWith('https://discordapp.com/api/webhooks/')) {
    return new Response(
      JSON.stringify({ error: 'Invalid Discord webhook URL' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Parse request body
  let body: NotifyRequest;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  if (!body.message || typeof body.message !== 'string') {
    return new Response(
      JSON.stringify({ error: 'Missing or invalid "message" field in body' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Pick a random character
  const character = getRandomCharacter();

  // Run OpenRouter and Tenor API calls in parallel
  const [rewrittenMessage, gifUrl] = await Promise.all([
    rewriteInCharacterVoice(body.message, character, body.source, body.severity),
    searchSopranosGif(character, body.severity),
  ]);

  // Post to Discord
  try {
    const discordResponse = await postToDiscord(
      webhookUrl,
      character,
      rewrittenMessage,
      gifUrl,
      body.message,
      body.source,
      body.severity
    );

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text();
      console.error('Discord webhook error:', errorText);
      return new Response(
        JSON.stringify({
          error: 'Failed to post to Discord webhook',
          details: errorText
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        character: character.name,
        originalMessage: body.message,
        rewrittenMessage: rewrittenMessage,
        gifUrl: gifUrl,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Discord webhook exception:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to post to Discord webhook' }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
