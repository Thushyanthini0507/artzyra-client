import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatLKR } from "@/lib/utils/currency";
import { formatTimeRange } from "@/lib/utils/timeFormat";
import { Booking } from "@/types/booking";
import { Artist } from "@/types/artist";
import { 
  MapPin, 
  Clock, 
  Calendar, 
  MessageSquare, 
  XCircle, 
  CheckCircle2, 
  Circle,
  CreditCard,
  Star
} from "lucide-react";
import Link from "next/link";

interface BookingHeaderProps {
  id: string;
  status: Booking["status"];
}

export function BookingHeader({ id, status }: BookingHeaderProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "confirmed":
      case "accepted":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "in_progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "declined":
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "completed":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Booking #{id.slice(-6).toUpperCase()}</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-gray-400">Status:</span>
          <Badge variant="outline" className={`capitalize border ${getStatusStyles(status)}`}>
            {status}
          </Badge>
        </div>
      </div>
    </div>
  );
}

interface BookingInfoProps {
  service: string;
  date: string;
  startTime?: string;
  endTime?: string;
  duration?: string; // Calculated or passed
}

export function BookingInfo({ service, date, startTime, endTime, duration }: BookingInfoProps) {
  return (
    <Card className="bg-[#1e1b29] border-white/5 shadow-lg">
      <CardHeader>
        <CardTitle className="text-white">Booking Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-400">Event Type</p>
          <p className="font-semibold text-white">{service}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-400">Date</p>
          <p className="font-semibold text-white">{new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-400">Time</p>
          <p className="font-semibold text-white">{formatTimeRange(startTime || "", endTime || "")}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-400">Duration</p>
          <p className="font-semibold text-white">{duration || "N/A"}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface LocationCardProps {
  address: string;
}

export function LocationCard({ address }: LocationCardProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2 text-white">Location</h3>
        <div className="flex items-start gap-2 text-gray-400">
          <MapPin className="h-4 w-4 mt-1 shrink-0" />
          <p>{address}</p>
        </div>
      </div>
      {/* Placeholder Map */}
      <div className="relative w-full h-48 bg-[#13111c] rounded-lg overflow-hidden flex items-center justify-center border border-white/5">
        <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center" />
        <p className="text-gray-500 font-medium z-10">Map View Unavailable</p>
      </div>
    </div>
  );
}

interface PricingSummaryProps {
  totalAmount: number;
}

export function PricingSummary({ totalAmount }: PricingSummaryProps) {
  // Mock breakdown for now as per plan
  const serviceFee = totalAmount * 0.05; // 5% service fee
  const basePrice = totalAmount - serviceFee;

  return (
    <Card className="bg-[#1e1b29] border-white/5 shadow-lg">
      <CardHeader>
        <CardTitle className="text-white">Pricing Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Base Fee</span>
          <span className="text-white">{formatLKR(basePrice)}</span>
        </div>
        {/* <div className="flex justify-between text-sm">
          <span className="text-gray-400">Travel & Equipment Fee</span>
          <span className="text-white">{formatLKR(1500)}</span> 
        </div> */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Platform Service Fee</span>
          <span className="text-white">{formatLKR(serviceFee)}</span>
        </div>
        <Separator className="bg-white/10" />
        <div className="flex justify-between font-bold text-lg text-white">
          <span>Total</span>
          <span>{formatLKR(totalAmount)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface ArtistCardProps {
  artist: Artist | string; // Handle both populated and ID string
  onContact?: () => void;
  onCancel?: () => void;
  bookingStatus: string;
}

export function ArtistCard({ artist, onContact, onCancel, bookingStatus }: ArtistCardProps) {
  // Handle both populated object and ID string, with fallbacks for missing fields
  const artistData = typeof artist === 'object' && artist !== null
    ? {
        name: artist.name || "Unknown Artist",
        category: artist.category || "Artist",
        profileImage: artist.profileImage || "",
        _id: artist._id || ""
      }
    : { name: "Unknown Artist", category: "Artist", profileImage: "", _id: artist || "" };

  return (
    <Card className="bg-[#1e1b29] border-white/5 shadow-lg h-fit">
      <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
        <Avatar className="h-24 w-24 border-4 border-[#13111c]">
          <AvatarImage src={artistData.profileImage} alt={artistData.name} />
          <AvatarFallback className="bg-[#5b21b6] text-white">{artistData.name?.charAt(0) || "?"}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="font-bold text-xl text-white">{artistData.name}</h3>
          <p className="text-sm text-gray-400">{artistData.category}</p>
          {/* <Link href={`/artist/${artistData._id}`} className="text-xs text-primary hover:underline">
            View Profile
          </Link> */}
        </div>
        
        <div className="w-full space-y-2 pt-4">
          <Button className="w-full gap-2 bg-[#5b21b6] hover:bg-[#4c1d95] text-white" onClick={onContact}>
            <MessageSquare className="h-4 w-4" /> Contact Artist
          </Button>
          {bookingStatus === 'pending' || bookingStatus === 'confirmed' ? (
             <Button variant="destructive" className="w-full gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 border" onClick={onCancel}>
             <XCircle className="h-4 w-4" /> Cancel Booking
           </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

interface BookingTimelineProps {
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function BookingTimeline({ status, createdAt, updatedAt }: BookingTimelineProps) {
  // Mock timeline steps based on status
  const steps = [
    { label: "Booking Requested", date: createdAt, completed: true },
    { label: "Booking Confirmed", date: status !== 'pending' ? updatedAt : null, completed: status !== 'pending' && status !== 'cancelled' && status !== 'declined' },
    // { label: "Payment Received", date: null, completed: false }, // We don't have payment date yet
    { label: "Service Completed", date: null, completed: status === 'completed' },
  ];

  return (
    <Card className="bg-[#1e1b29] border-white/5 shadow-lg">
      <CardHeader>
        <CardTitle className="text-white">Booking History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6 pl-2">
          {/* Vertical Line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-white/10" />

          {steps.map((step, index) => (
            <div key={index} className="relative flex gap-4 items-start">
              <div className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${step.completed ? "bg-[#5b21b6] border-[#5b21b6] text-white" : "bg-[#13111c] border-white/20"}`}>
                {step.completed ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3 text-gray-500" />}
              </div>
              <div className="space-y-1">
                <p className={`text-sm font-medium leading-none ${step.completed ? "text-white" : "text-gray-500"}`}>
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-xs text-gray-500">
                    {new Date(step.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
