'use server';

/**
 * @fileOverview A flow to detect the language of an audio sample.
 *
 * - detectAudioLanguage - A function that detects the language of an audio sample.
 * - DetectAudioLanguageInput - The input type for the detectAudioLanguage function.
 * - DetectAudioLanguageOutput - The return type for the detectAudioLanguage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAudioLanguageInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A Base64-encoded MP3 audio sample as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectAudioLanguageInput = z.infer<typeof DetectAudioLanguageInputSchema>;

const DetectAudioLanguageOutputSchema = z.object({
  language: z
    .string()
    .describe('The detected language of the audio sample (Tamil, English, Hindi, Malayalam, or Telugu).'),
});
export type DetectAudioLanguageOutput = z.infer<typeof DetectAudioLanguageOutputSchema>;

export async function detectAudioLanguage(input: DetectAudioLanguageInput): Promise<DetectAudioLanguageOutput> {
  return detectAudioLanguageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectAudioLanguagePrompt',
  input: {schema: DetectAudioLanguageInputSchema},
  output: {schema: DetectAudioLanguageOutputSchema},
  prompt: `You are an expert in language detection. Analyze the provided audio sample and determine the language spoken. The language must be one of the following: Tamil, English, Hindi, Malayalam, or Telugu. Return ONLY the language name.

Audio Sample: {{media url=audioDataUri}}`,
});

const detectAudioLanguageFlow = ai.defineFlow(
  {
    name: 'detectAudioLanguageFlow',
    inputSchema: DetectAudioLanguageInputSchema,
    outputSchema: DetectAudioLanguageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
