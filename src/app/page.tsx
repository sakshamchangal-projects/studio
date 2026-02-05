import { VoiceGuardApp } from '@/components/voice-guard-app';
import { VoiceGuardLogo } from '@/components/voice-guard-logo';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b border-primary/20 bg-background/50 px-4 backdrop-blur-sm md:px-8">
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
