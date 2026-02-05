import { VoiceGuardApp } from '@/components/voice-guard-app';
import { VoiceGuardLogo } from '@/components/voice-guard-logo';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <VoiceGuardLogo />
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
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
