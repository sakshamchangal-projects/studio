'use server';

import { analyzeAudioSample } from '@/ai/flows/analyze-audio-sample';
import type { AnalyzeAudioSampleOutput } from '@/ai/flows/analyze-audio-sample';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_FILE_TYPES = ['audio/mpeg'];

const FormSchema = z.object({
  audioFile: z
    .any()
    .refine(file => !!file && file.size > 0, 'No audio file provided.')
    .refine(
      file => file?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      file => ACCEPTED_FILE_TYPES.includes(file?.type),
      'Only .mp3 files are accepted.'
    ),
});

export interface AnalysisState {
  result?: AnalyzeAudioSampleOutput;
  error?: string;
}

export async function handleAudioAnalysis(
  prevState: AnalysisState | null,
  formData: FormData
): Promise<AnalysisState> {
  const file = formData.get('audioFile') as File;

  const validatedFields = FormSchema.safeParse({
    audioFile: file,
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.audioFile?.join(', '),
    };
  }

  try {
    const buffer = await file.arrayBuffer();
    const base64String = Buffer.from(buffer).toString('base64');
    const audioDataUri = `data:${file.type};base64,${base64String}`;

    const result = await analyzeAudioSample({ audioDataUri });

    if (!result) {
      return { error: 'Analysis failed to return a result.' };
    }

    return { result };
  } catch (e) {
    console.error(e);
    const errorMessage =
      e instanceof Error ? e.message : 'An unknown error occurred during analysis.';
    return { error: `Analysis failed: ${errorMessage}` };
  }
}
