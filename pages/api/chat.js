import OpenAI from "openai";

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  if (message.trim().toLowerCase() === "who are u") {
    return res.status(200).json({ reply: "I am FoodBridge AI chatbot." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-4.0" or "gpt-3.5-turbo"
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message }
      ],
      max_tokens: 100,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || message;
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from OpenAI.' });
  }
} 