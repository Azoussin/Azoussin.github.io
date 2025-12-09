import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Upload, Bot } from "lucide-react";

/**
 * Landing page - redirects to login or dashboard based on auth status
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              VAUL AI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Your Secure Smart Vault
            </p>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Store your notes, manage files, and leverage AI-powered assistance
            - all in one secure platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg">
              <Link href="/login">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/register">Create Account</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="space-y-3 text-center">
              <div className="flex justify-center">
                <Shield className="w-12 h-12 text-primary" />
              </div>
              <h3 className="font-semibold">Secure Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Protected with Supabase Auth
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="flex justify-center">
                <FileText className="w-12 h-12 text-primary" />
              </div>
              <h3 className="font-semibold">Smart Notes</h3>
              <p className="text-sm text-muted-foreground">
                Create and manage your notes
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="flex justify-center">
                <Upload className="w-12 h-12 text-primary" />
              </div>
              <h3 className="font-semibold">File Storage</h3>
              <p className="text-sm text-muted-foreground">
                Upload and organize files
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="flex justify-center">
                <Bot className="w-12 h-12 text-primary" />
              </div>
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-sm text-muted-foreground">
                GPT-powered help and insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
