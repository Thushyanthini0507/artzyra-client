import { ArtistLayoutNew } from "@/components/layout/artist-layout-new";

export default function ArtistLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ArtistLayoutNew>{children}</ArtistLayoutNew>;
}
