import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import OpenAI from 'openai';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const API_KEY = process.env.CLOUD_VISION_KEY;
const VISION_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;
const YOU_TUBE_API_KEY = process.env.YOU_TUBE_KEY;

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

app.post('/api/analyze', async (req, res) => {
  const { base64Image } = req.body;

  try {
    const response = await axios.post(VISION_URL, {
      requests: [
        {
          image: { content: base64Image },
          features: [{ type: 'LABEL_DETECTION', maxResults: 5 }],
        },
      ],
    });

    const data = response.data as { responses: any[] };
    res.json(data.responses[0]);
  } catch (err: any) {
    console.error('Vision API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

app.post('/api/openai', async (req, res) => {
  const { prompt, labels } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    const text = completion.choices[0].message.content;

    const query =
      labels && labels.length > 0 ? labels.join(' ') : 'DIY tutorial';
    const ytResponse = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          part: 'snippet',
          q: query,
          maxResults: 1,
          key: YOU_TUBE_API_KEY,
          type: 'video',
          videoEmbeddable: 'true',
        },
      }
    );

    const ytData = ytResponse.data as {
      items?: { id?: { videoId?: string } }[];
    };
    const videoId = ytData.items?.[0]?.id?.videoId || null;
    const videoUrl = videoId
      ? `https://www.youtube.com/watch?v=${videoId}`
      : null;

    res.json({ text, videoUrl });
  } catch (error) {
    console.error('OpenAI or YouTube API error:', error);
    res.status(500).json({ error: 'Request failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
