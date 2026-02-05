'use client';

import { useActionState, useState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { handleAudioAnalysis, type AnalysisState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UploadCloud, FileAudio, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalysisResult } from './analysis-result';
import { useToast } from '@/hooks/use-toast';

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className="mt-6 w-full"
      size="lg"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Analyze Audio'
      )}
    </Button>
  );
}

function ResultPanel({ state }: { state: AnalysisState | null }) {
  const { pending } = useFormStatus();

  const Placeholder = ({ children }: { children: React.ReactNode }) => (
    <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-6 text-center text-muted-foreground">
      {children}
    </div>
  );

  if (pending) {
    return (
      <Placeholder>
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg font-semibold">Analyzing your audio...</p>
        <p className="text-sm">This may take a moment.</p>
      </Placeholder>
    );
  }

  if (state?.result) {
    return <AnalysisResult result={state.result} />;
  }

  return (
    <Placeholder>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mx-auto text-primary"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
      </svg>
      <p className="mt-4 text-lg font-semibold">Results will appear here</p>
      <p className="text-sm">Upload an audio file to begin.</p>
    </Placeholder>
  );
}

export function VoiceGuardApp() {
  const [state, formAction] = useActionState(handleAudioAnalysis, null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.type !== 'audio/mpeg') {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload an MP3 file.',
        });
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File Too Large',
          description: 'Please upload a file smaller than 5MB.',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid w-full gap-8 md:grid-cols-2"
    >
      <Card className="flex flex-col border-2 border-border shadow-2xl shadow-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Upload Audio</CardTitle>
          <CardDescription>
            Upload an MP3 to classify it as AI or human-generated.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-between">
          <fieldset disabled={pending}>
            <input
              type="file"
              name="audioFile"
              ref={fileInputRef}
              className="hidden"
              accept="audio/mpeg"
              onChange={e => handleFileChange(e.target.files?.[0] || null)}
            />
            {!file ? (
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={onButtonClick}
                className={cn(
                  'relative flex h-full min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center transition-all duration-300',
                  isDragging
                    ? 'border-primary bg-primary/10 scale-105'
                    : 'hover:border-primary/50 hover:bg-accent'
                )}
              >
                <div className="z-10">
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 font-semibold">
                    Drag & drop an MP3 file
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse (max 5MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-lg border bg-secondary/50 p-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileAudio className="h-8 w-8 flex-shrink-0 text-primary" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={removeFile}
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </fieldset>
          <SubmitButton disabled={!file} />
        </CardContent>
      </Card>
      <Card className="shadow-2xl shadow-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Analysis Result</CardTitle>
          <CardDescription>
            The classification of your audio sample will appear below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResultPanel state={state} />
        </CardContent>
      </Card>
    </form>
  );
}
