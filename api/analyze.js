import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { imageUrl } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision",
      messages: [
        {
          role: "system",
          content: "Describe this clothing item for a resale listing.",
        },
        {
          role: "user",
          content: [
            { type: "text", content: "Describe the image." },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
    });
    res.status(200).json({ description: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
