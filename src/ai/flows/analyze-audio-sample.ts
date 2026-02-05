'use server';

/**
 * @fileOverview Analyzes an audio sample to determine if it is AI-generated or human.
 *
 * - analyzeAudioSample - A function that analyzes the audio sample.
 * - AnalyzeAudioSampleInput - The input type for the analyzeAudioSample function.
 * - AnalyzeAudioSampleOutput - The return type for the analyzeAudioSample function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAudioSampleInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'A Base64-encoded MP3 audio sample as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'      
    ),
});
export type AnalyzeAudioSampleInput = z.infer<typeof AnalyzeAudioSampleInputSchema>;

const AnalyzeAudioSampleOutputSchema = z.object({
  classification: z
    .enum(['AI_GENERATED', 'HUMAN'])
    .describe('The classification result of the audio sample.'),
  confidenceScore: z
    .number()
    .min(0)
    .max(1)
    .describe('The confidence score (0.0 to 1.0) of the classification.'),
  detectedLanguage: z.string().optional().describe('The detected language of the audio sample.'),
});
export type AnalyzeAudioSampleOutput = z.infer<typeof AnalyzeAudioSampleOutputSchema>;

export async function analyzeAudioSample(
  input: AnalyzeAudioSampleInput
): Promise<AnalyzeAudioSampleOutput> {
  return analyzeAudioSampleFlow(input);
}

const analyzeAudioSamplePrompt = ai.definePrompt({
  name: 'analyzeAudioSamplePrompt',
  input: {schema: AnalyzeAudioSampleInputSchema},
  output: {schema: AnalyzeAudioSampleOutputSchema},
  prompt: `You are an AI model specializing in audio analysis.

You are given an audio sample, and your task is to determine whether the audio is AI-generated or spoken by a real human.

You should also attempt to detect the language of the audio sample. The supported languages are Tamil, English, Hindi, Malayalam, and Telugu.

Respond with a JSON object containing the classification result (AI_GENERATED or HUMAN), a confidence score (0.0 to 1.0), and the detected language (if detectable). 

Audio Sample: {{media url=audioDataUri}}
`,
});

const analyzeAudioSampleFlow = ai.defineFlow(
  {
    name: 'analyzeAudioSampleFlow',
    inputSchema: AnalyzeAudioSampleInputSchema,
    outputSchema: AnalyzeAudioSampleOutputSchema,
  },
  async input => {
    const {output} = await analyzeAudioSamplePrompt(input);
    return output!;
  }
);
