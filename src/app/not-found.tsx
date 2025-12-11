import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#2d1b4e] text-white p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-8 p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
        <h1 className="text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
          404
        </h1>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight">
            Page Not Found
          </h2>
          <p className="text-lg text-white/70 max-w-md mx-auto">
            Oops! The page you are looking for seems to have vanished into the digital void.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            asChild 
            size="lg" 
            className="bg-white text-[#2d1b4e] hover:bg-white/90 font-semibold transition-all duration-300 shadow-lg hover:shadow-white/20"
          >
            <Link href="/">
              <MoveLeft className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="border-white/20 text-white hover:bg-white/10 hover:text-white transition-all duration-300"
          >
            <Link href="/contact">
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
      
      <footer className="absolute bottom-8 text-white/30 text-sm">
        &copy; {new Date().getFullYear()} Artzyra. All rights reserved.
      </footer>
    </div>
  );
}
