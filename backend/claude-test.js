/*
  Lightweight Claude API smoke test. Reads ANTHROPIC_API_KEY from env.
  Usage: node claude-test.js "your prompt here"
*/

const Anthropic = require('@anthropic-ai/sdk');

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY || '';
  if (!apiKey) {
    console.error('Missing ANTHROPIC_API_KEY in environment.');
    process.exitCode = 1;
    return;
  }

  const client = new Anthropic({ apiKey });
  const userPrompt = process.argv.slice(2).join(' ').trim() || 'Say hello in one short sentence.';

  try {
    const resp = await client.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 128,
      messages: [
        { role: 'user', content: userPrompt },
      ],
    });

    const text = resp?.content?.[0]?.type === 'text' ? resp.content[0].text : '';
    console.log(text || JSON.stringify(resp, null, 2));
  } catch (err) {
    const message = err?.message || String(err);
    const status = err?.status || err?.code || 'unknown';
    console.error(`Claude request failed (${status}): ${message}`);
    process.exitCode = 1;
  }
}

main();


