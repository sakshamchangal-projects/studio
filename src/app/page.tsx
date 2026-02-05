'use client';

import { useState } from 'react';
import { VoiceGuardApp } from '@/components/voice-guard-app';
import { VoiceGuardLogo } from '@/components/voice-guard-logo';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);

  if (!isStarted) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
        <div
          key="start-screen"
          className="flex flex-col items-center gap-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <VoiceGuardLogo className="h-24 w-24" />
          <h1 className="text-5xl font-extrabold tracking-tighter text-foreground">
            Welcome to VoiceGuard
          </h1>
          <p className="max-w-2xl text-xl text-muted-foreground">
            Your personal shield against AI-generated voice impersonation.
            Upload an audio file, and we&apos;ll tell you if it&apos;s real or AI.
          </p>
          <Button
            size="lg"
            className="mt-4 gap-2"
            onClick={() => setIsStarted(true)}
          >
            <ShieldCheck />
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b border-primary/10 bg-background/50 px-4 backdrop-blur-sm md:px-8">
        <VoiceGuardLogo />
        <h1 className="text-3xl font-bold tracking-tighter text-foreground">
          VoiceGuard
        </h1>
      </header>
      <main className="flex flex-1 flex-col items-center justify-start p-4 md:p-8">
        <div className="w-full max-w-6xl">
          <VoiceGuardApp />
        </div>
      </main>
    </div>
  );
}
