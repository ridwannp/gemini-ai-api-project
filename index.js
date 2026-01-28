import {GoogleGenAI} from '@google/genai';
import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import {text} from 'stream/consumers';

const app = express();
const upload = multer();
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
const GEMINI_MODEL = 'gemini-2.5-flash-lite';

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 3000;

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