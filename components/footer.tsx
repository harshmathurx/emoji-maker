import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
          <Link 
            href="/terms" 
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Terms & Conditions
          </Link>
          <Link 
            href="/privacy" 
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/refund" 
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
} 