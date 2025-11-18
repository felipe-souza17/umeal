import { TrendingUp } from "lucide-react";

export function PromoBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 to-primary/10 border-b border-border">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,87,34,0.1)_25%,transparent_25%,transparent_50%,rgba(255,87,34,0.1)_50%,rgba(255,87,34,0.1)_75%,transparent_75%,transparent)] bg-[length:40px_40px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-foreground" size={20} />
              <h2 className="text-2xl font-bold text-foreground">
                Order Now, Save More!
              </h2>
            </div>
            <p className="text-muted-foreground">
              Get 20% off on your first order with code{" "}
              <span className="font-mono font-semibold text-foreground">
                UMEAL20
              </span>
            </p>
          </div>
          <button className="hidden rounded-lg bg-primary px-6 py-2 font-medium text-foreground-foreground transition-all hover:bg-primary/90 sm:block">
            Claim Deal
          </button>
        </div>
      </div>
    </div>
  );
}
