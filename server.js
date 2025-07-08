import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/analyze", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: "Describe this clothing item for an online resale listing.",
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
    res.json({ description: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
