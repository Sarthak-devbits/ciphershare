import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function LandingPage() {
  return (
    <div className="relative w-full overflow-hidden bg-background">
      {/* Blurred Gradient Blob Backgrounds */}
      <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-blue-300 opacity-30 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-green-300 opacity-20 rounded-full blur-2xl z-0"></div>
      <div className="absolute top-1/3 left-1/2 w-[300px] h-[300px] bg-purple-300 opacity-20 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 z-0"></div>

      {/* Hero Section */}
      <section className="relative w-full py-20 sm:py-24 md:py-32 lg:py-40 flex items-center justify-center px-4 z-10">
        <div className="container flex flex-col items-center text-center max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight tracking-tight mb-6">
            End-to-End Encrypted File Sharing, Simplified
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-xl">
            Encrypt and share files directly from your browser — no servers ever
            see your data.
          </p>
          <Link
            to="/encrypt"
            className="inline-flex items-center justify-center px-5 py-3 sm:px-6 sm:py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Encrypt a File
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="relative w-full py-16 sm:py-20 bg-muted/30 px-4 z-10"
      >
        <div className="container max-w-4xl">
          <h2 className="text-xl sm:text-2xl font-semibold mb-10 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[
              {
                step: "1",
                title: "Encrypt Locally",
                desc: "Your files never leave your device unencrypted. All encryption happens in your browser.",
              },
              {
                step: "2",
                title: "Share Securely",
                desc: "Generate a secure link with the decryption key embedded or protected by a password.",
              },
              {
                step: "3",
                title: "Recipient Decrypts",
                desc: "Recipients decrypt the file in their browser. No accounts or software needed.",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary text-lg font-medium mb-4">
                  {step}
                </div>
                <h3 className="text-base sm:text-lg font-medium mb-2">
                  {title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
