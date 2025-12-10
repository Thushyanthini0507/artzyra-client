import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatLKR } from "@/lib/utils/currency";
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "accepted":
      case "completed":
        return "default"; // usually primary color or green depending on theme, using default for now
      case "pending":
        return "secondary";
      case "cancelled":
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Booking #{id.slice(-6).toUpperCase()}</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-muted-foreground">Status:</span>
          <Badge variant={getStatusColor(status)} className="capitalize">
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
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle>Booking Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Event Type</p>
          <p className="font-semibold">{service}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Date</p>
          <p className="font-semibold">{new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Time</p>
          <p className="font-semibold">{startTime && endTime ? `${startTime} - ${endTime}` : "Time not set"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Duration</p>
          <p className="font-semibold">{duration || "N/A"}</p>
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
        <h3 className="font-semibold mb-2">Location</h3>
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 mt-1 shrink-0" />
          <p>{address}</p>
        </div>
      </div>
      {/* Placeholder Map */}
      <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden flex items-center justify-center border">
        <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center" />
        <p className="text-muted-foreground font-medium z-10">Map View Unavailable</p>
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
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle>Pricing Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Base Fee</span>
          <span>{formatLKR(basePrice)}</span>
        </div>
        {/* <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Travel & Equipment Fee</span>
          <span>{formatLKR(1500)}</span> 
        </div> */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Platform Service Fee</span>
          <span>{formatLKR(serviceFee)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
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
  const artistData = typeof artist === 'object' ? artist : { name: "Unknown Artist", category: "Artist", profileImage: "", _id: artist };

  return (
    <Card className="bg-card/50 h-fit">
      <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={artistData.profileImage} alt={artistData.name} />
          <AvatarFallback>{artistData.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="font-bold text-xl">{artistData.name}</h3>
          <p className="text-sm text-muted-foreground">{artistData.category}</p>
          {/* <Link href={`/artist/${artistData._id}`} className="text-xs text-primary hover:underline">
            View Profile
          </Link> */}
        </div>
        
        <div className="w-full space-y-2 pt-4">
          <Button className="w-full gap-2 bg-primary/90 hover:bg-primary" onClick={onContact}>
            <MessageSquare className="h-4 w-4" /> Contact Artist
          </Button>
          {bookingStatus === 'pending' || bookingStatus === 'accepted' ? (
             <Button variant="destructive" className="w-full gap-2 bg-red-900/20 text-red-500 hover:bg-red-900/40 border-red-900/20 border" onClick={onCancel}>
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
    { label: "Booking Confirmed", date: status !== 'pending' ? updatedAt : null, completed: status !== 'pending' && status !== 'cancelled' && status !== 'rejected' },
    // { label: "Payment Received", date: null, completed: false }, // We don't have payment date yet
    { label: "Service Completed", date: null, completed: status === 'completed' },
  ];

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle>Booking History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6 pl-2">
          {/* Vertical Line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-muted" />

          {steps.map((step, index) => (
            <div key={index} className="relative flex gap-4 items-start">
              <div className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${step.completed ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-muted-foreground/30"}`}>
                {step.completed ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3 text-muted-foreground" />}
              </div>
              <div className="space-y-1">
                <p className={`text-sm font-medium leading-none ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-xs text-muted-foreground">
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
