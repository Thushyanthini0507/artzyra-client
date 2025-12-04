import { Suspense } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { BrowseArtists } from "@/components/BrowseArtists";
import { Loader2 } from "lucide-react";

export default function BrowsePage() {
  return (
    <PublicLayout>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <BrowseArtists />
      </Suspense>
    </PublicLayout>
  );
}
