'use client';

import { useState, useRef, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { handleAudioAnalysis, type AnalysisState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Upload, FileAudio, X, Loader2 } from 'lucide-react';
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
    <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-secondary/50 p-6 text-center text-muted-foreground">
      {children}
    </div>
  );

  if (pending) {
    return (
      <Placeholder>
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 font-semibold">Analyzing your audio...</p>
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
        className="mx-auto"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
      </svg>
      <p className="mt-4 font-semibold">Results will appear here</p>
      <p className="text-sm">Upload an audio file to begin.</p>
    </Placeholder>
  );
}

export function VoiceGuardApp() {
  const [state, formAction] = useFormState(handleAudioAnalysis, null);
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
      <Card className="flex flex-col shadow-lg">
        <CardHeader>
          <CardTitle>Upload Audio Sample</CardTitle>
          <CardDescription>
            Upload an MP3 audio file to classify it as AI or human-generated
            speech.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <div className="flex-grow">
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
                    'flex h-full min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors cursor-pointer',
                    isDragging
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 font-semibold">
                    Drag & drop an MP3 file here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Max file size: 5MB
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-lg border bg-secondary p-4">
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
          </div>
          <SubmitButton disabled={!file} />
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Analysis Result</CardTitle>
          <CardDescription>
            The classification of your audio sample will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResultPanel state={state} />
        </CardContent>
      </Card>
    </form>
  );
}
