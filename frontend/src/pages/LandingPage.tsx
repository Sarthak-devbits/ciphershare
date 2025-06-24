import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
export function LandingPage() {

  return (
    <div className="w-full">
      <section className="w-full py-24 md:py-32 lg:py-40 flex items-center justify-center">
        <div className="container flex flex-col items-center text-center max-w-3xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tighter mb-6">
            End-to-End Encrypted File Sharing, Simplified
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
            Encrypt and share files directly from your browser — no servers ever
            see your data.
          </p>
          <Link
            to="/encrypt"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Encrypt a File
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
      <section id="how-it-works" className="w-full py-16 bg-muted/30">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-medium mb-10 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                1
              </div>
              <h3 className="text-lg font-medium mb-2">Encrypt Locally</h3>
              <p className="text-muted-foreground">
                Your files never leave your device unencrypted. All encryption
                happens in your browser.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                2
              </div>
              <h3 className="text-lg font-medium mb-2">Share Securely</h3>
              <p className="text-muted-foreground">
                Generate a secure link with the decryption key embedded or
                protected by a password.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                3
              </div>
              <h3 className="text-lg font-medium mb-2">Recipient Decrypts</h3>
              <p className="text-muted-foreground">
                Recipients decrypt the file in their browser. No accounts or
                software needed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
