import {GoogleGenAI} from '@google/genai';
import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import {text} from 'stream/consumers';
import 'dotenv/config';

const app = express();
const upload = multer();
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
const GEMINI_MODEL = 'gemini-2.5-flash-lite';

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./'));

const PORT = process.env.PORT || 3000;

app.post('/api/chat', async (req, res) => {
    const { conversation } = req.body;
    if (!conversation || !conversation.length) {
        return res.status(400).json({ error: 'Conversation is required' });
    }

    const lastMessage = conversation[conversation.length - 1].content;

    try {
        const model = ai.getGenerativeModel({ 
            model: GEMINI_MODEL,
            systemInstruction: "Anda adalah seorang ahli ekspor dan impor barang yang berpengalaman. Anda memberikan saran profesional, teknis, dan praktis terkait prosedur kepabeanan, logistik internasional, regulasi perdagangan, dan strategi bisnis global. Gunakan bahasa Indonesia yang profesional namun mudah dimengerti."
        });
        const result = await model.generateContent(lastMessage);
        const response = await result.response;
        const textValue = response.text();

        res.status(200).json({
            result: textValue,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post(
  '/generate-text',
  upload.none(),
  async (req, res) => {
    const {prompt} = req.body;

    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      res.status(200).json({
        result: response.text,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({error: 'Internal Server Error'});
    }
  },
);

app.post(
  '/generate-from-image',
  upload.single('image'),
  async (req, res) => {
    try {
      const {prompt} = req.body;
      const base64Image =
        req.file.buffer.toString('base64');

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          {text: prompt, type: 'text'},
          {
            inlineData: {
              data: base64Image,
              mimeType: req.file.mimetype,
            },
          },
        ],
      });

      res.status(200).json({
        result: response.text,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({error: 'Internal Server Error'});
    }
  },
);

app.post(
  '/generate-from-document',
  upload.single('document'),
  async (req, res) => {
    try {
      const {prompt} = req.body;
      const base64Document =
        req.file.buffer.toString('base64');

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          {text: prompt, type: 'text'},
          {
            inlineData: {
              data: base64Document,
              mimeType: req.file.mimetype,
            },
          },
        ],
        config: {
          systemInstruction:
            'You are a cat. Your name is Neko. You will end every sentence with "Nyan~',
        },
      });
      res.status(200).json({
        result: response.text,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({error: 'Internal Server Error'});
    }
  },
);

app.post(
  '/generate-from-audio',
  upload.single('audio'),
  async (req, res) => {
    try {
      const {prompt} = req.body;
      const base64Audio =
        req.file.buffer.toString('base64');

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          {text: prompt, type: 'text'},
          {
            inlineData: {
              data: base64Audio,
              mimeType: req.file.mimetype,
            },
          },
        ],
      });

      res.status(200).json({
        result: response.text,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({error: 'Internal Server Error'});
    }
  },
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// The client gets the API key from the environment variable `GEMINI_API_KEY`.

// async function main() {
//   const response = await ai.models.generateContent({
//     model: 'gemini-2.5-flash-lite',
//     contents: 'WHAT IS THE BEST MOVIE EVER MADE?',
//   });
//   console.log(response.text);
// }

// main();