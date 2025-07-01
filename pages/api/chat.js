import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
        { role: "system", content: `You are FoodBridge AI, a helpful assistant for a food donation platform. Here are the platform's features you should use to help users:

1. Home: Main entry point, connects all features via top-level navigation.
2. Sign Up/Login: Users must sign up or log in for full access (KYC, security).
3. Dashboard: Personalized panel with activity overview, available listings, and recent donations (with details).
4. Food Donation: Users can submit food donations via a form.
5. Food Listings: Categorized listings (1, 2, 3, etc.), with details, claim request system (map integration), submit request, and real-time chat with donor.
6. Nearby Food Listings: View donations based on user location (map integration).
7. Inbox: Messaging section with separate chats for donor-recipient communication.
8. My Request: Manage food claims with subpages for all, pending, and accepted requests.
9. Notifications: All, unread, and donation-related notifications.
10. Awareness & Education Blog: Articles on food waste, sustainability, and community efforts.
11. Profile: Edit profile, overview of activities, settings, and donation history.

Always answer user questions with this context in mind, and guide them to the right feature or action on the platform.` },
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