"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/date-picker";
import { Controller } from "react-hook-form";
import { useCreateBooking } from "@/hooks/useCustomerHooks";
import { toast } from "sonner";
import { Upload, X, Link as LinkIcon, FileText } from "lucide-react";

const remoteBookingSchema = z.object({
  // Service Selection
  service: z.string().min(1, "Service type is required"),
  package: z.enum(["basic", "standard", "premium", "custom"]),
  customRequirements: z.string().optional(),
  
  // Project Details
  projectTitle: z.string().min(1, "Project title is required"),
  projectDescription: z.string().min(10, "Project description must be at least 10 characters"),
  referenceLinks: z.array(z.string().url("Invalid URL")).optional(),
  referenceLinkInput: z.string().optional(),
  
  // Delivery Timeline
  expectedDeliveryDate: z.date({
    required_error: "Expected delivery date is required",
  }),
  urgency: z.enum(["normal", "express"]),
  revisionCount: z.number().min(0).max(10).default(3),
  
  // Communication
  emailUpdates: z.boolean().default(false),
  
  // Pricing & Payment
  pricingType: z.enum(["package", "custom_quote"]),
  paymentType: z.enum(["advance", "full"]),
  advancePercentage: z.number().min(0).max(100).optional(),
});

type RemoteBookingFormData = z.infer<typeof remoteBookingSchema>;

interface RemoteWorkBookingFormProps {
  artistId: string;
  artistName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const SERVICE_TYPES = [
  "Logo Design",
  "Video Editing",
  "Online Class",
  "Voice-over",
  "Graphic Design",
  "Web Design",
  "Content Writing",
  "Social Media Management",
  "Photography Editing",
  "Animation",
  "Other",
];

const PACKAGE_PRICES = {
  basic: { name: "Basic", multiplier: 1 },
  standard: { name: "Standard", multiplier: 1.5 },
  premium: { name: "Premium", multiplier: 2 },
  custom: { name: "Custom", multiplier: 0 },
};

export function RemoteWorkBookingForm({
  artistId,
  artistName,
  onSuccess,
  onCancel,
}: RemoteWorkBookingFormProps) {
  const { createBooking, loading } = useCreateBooking();
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ url: string; filename: string; fileType: string }>>([]);
  const [referenceLinks, setReferenceLinks] = useState<string[]>([]);
  const [referenceLinkInput, setReferenceLinkInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RemoteBookingFormData>({
    resolver: zodResolver(remoteBookingSchema),
    defaultValues: {
      package: "basic",
      urgency: "normal",
      revisionCount: 3,
      emailUpdates: false,
      pricingType: "package",
      paymentType: "full",
      advancePercentage: 50,
    },
  });

  const selectedPackage = watch("package");
  const pricingType = watch("pricingType");
  const paymentType = watch("paymentType");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // In a real implementation, upload to Cloudinary or your file storage
    // For now, we'll create placeholder URLs
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedFiles((prev) => [
          ...prev,
          {
            url: reader.result as string,
            filename: file.name,
            fileType: file.type,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addReferenceLink = () => {
    if (referenceLinkInput.trim() && z.string().url().safeParse(referenceLinkInput).success) {
      setReferenceLinks((prev) => [...prev, referenceLinkInput.trim()]);
      setReferenceLinkInput("");
    } else {
      toast.error("Please enter a valid URL");
    }
  };

  const removeReferenceLink = (index: number) => {
    setReferenceLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: RemoteBookingFormData) => {
    try {
      // Calculate total amount based on package (you might want to fetch this from artist's pricing)
      const basePrice = 1000; // This should come from artist's pricing
      const packageMultiplier = PACKAGE_PRICES[data.package].multiplier;
      const totalAmount = pricingType === "package" 
        ? basePrice * packageMultiplier 
        : 0; // Custom quote will be set by artist

      const bookingData = {
        artistId,
        service: data.service,
        package: data.package,
        customRequirements: data.customRequirements,
        projectTitle: data.projectTitle,
        projectDescription: data.projectDescription,
        referenceLinks,
        uploadedFiles,
        expectedDeliveryDate: data.expectedDeliveryDate.toISOString(),
        urgency: data.urgency,
        revisionCount: { limit: data.revisionCount },
        emailUpdates: data.emailUpdates,
        pricingType: data.pricingType,
        packagePrice: pricingType === "package" ? totalAmount : undefined,
        paymentType: data.paymentType,
        advancePercentage: data.paymentType === "advance" ? data.advancePercentage : undefined,
        totalAmount: pricingType === "package" ? totalAmount : 0,
      };

      await createBooking(bookingData);
      toast.success("Booking request created successfully!");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Remote Work Booking Form</CardTitle>
          <CardDescription>
            Book {artistName} for remote work. Fill in all required details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="service" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="service">Service</TabsTrigger>
              <TabsTrigger value="project">Project</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
            </TabsList>

            {/* Service Selection Tab */}
            <TabsContent value="service" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service">Service Type *</Label>
                <Controller
                  name="service"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_TYPES.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.service && (
                  <p className="text-sm text-red-500">{errors.service.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Package Selection *</Label>
                <Controller
                  name="package"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      {Object.entries(PACKAGE_PRICES).map(([key, pkg]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <RadioGroupItem value={key} id={key} />
                          <Label htmlFor={key} className="cursor-pointer">
                            {pkg.name}
                            {key !== "custom" && ` (${pkg.multiplier}x)`}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
              </div>

              {selectedPackage === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="customRequirements">Custom Requirements *</Label>
                  <Textarea
                    id="customRequirements"
                    placeholder="Describe your custom requirements..."
                    {...register("customRequirements")}
                  />
                  {errors.customRequirements && (
                    <p className="text-sm text-red-500">{errors.customRequirements.message}</p>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Project Details Tab */}
            <TabsContent value="project" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectTitle">Project Title *</Label>
                <Input
                  id="projectTitle"
                  placeholder="e.g., Company Logo Redesign"
                  {...register("projectTitle")}
                />
                {errors.projectTitle && (
                  <p className="text-sm text-red-500">{errors.projectTitle.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription">Detailed Description / Brief *</Label>
                <Textarea
                  id="projectDescription"
                  placeholder="Provide a detailed description of your project requirements..."
                  rows={6}
                  {...register("projectDescription")}
                />
                {errors.projectDescription && (
                  <p className="text-sm text-red-500">{errors.projectDescription.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Reference Links</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://drive.google.com/..."
                    value={referenceLinkInput}
                    onChange={(e) => setReferenceLinkInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addReferenceLink();
                      }
                    }}
                  />
                  <Button type="button" onClick={addReferenceLink} variant="outline">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                {referenceLinks.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {referenceLinks.map((link, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 truncate">
                          {link}
                        </a>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeReferenceLink(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileUpload">File Upload</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="fileUpload"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="fileUpload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Images, documents, PDFs (Max 10MB per file)
                    </p>
                  </label>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{file.filename}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Delivery Timeline Tab */}
            <TabsContent value="delivery" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="expectedDeliveryDate">Expected Delivery Date *</Label>
                <Controller
                  name="expectedDeliveryDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select delivery date"
                    />
                  )}
                />
                {errors.expectedDeliveryDate && (
                  <p className="text-sm text-red-500">{errors.expectedDeliveryDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Urgency *</Label>
                <Controller
                  name="urgency"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="normal" id="normal" />
                        <Label htmlFor="normal" className="cursor-pointer">Normal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="cursor-pointer">Express (Additional fee may apply)</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="revisionCount">Revision Count Required *</Label>
                <Input
                  id="revisionCount"
                  type="number"
                  min="0"
                  max="10"
                  {...register("revisionCount", { valueAsNumber: true })}
                />
                {errors.revisionCount && (
                  <p className="text-sm text-red-500">{errors.revisionCount.message}</p>
                )}
                <p className="text-xs text-gray-500">Number of revisions included in this package</p>
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  name="emailUpdates"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="emailUpdates"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="emailUpdates" className="cursor-pointer">
                  Receive email updates (Optional)
                </Label>
              </div>
            </TabsContent>

            {/* Pricing & Payment Tab */}
            <TabsContent value="payment" className="space-y-4">
              <div className="space-y-2">
                <Label>Pricing Type *</Label>
                <Controller
                  name="pricingType"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="package" id="package" />
                        <Label htmlFor="package" className="cursor-pointer">Auto price based on package</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom_quote" id="custom_quote" />
                        <Label htmlFor="custom_quote" className="cursor-pointer">Request custom quote from artist</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              {pricingType === "package" && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium">Estimated Price</p>
                  <p className="text-2xl font-bold">
                    LKR {PACKAGE_PRICES[selectedPackage].multiplier * 1000}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Final price may vary based on artist's rates
                  </p>
                </div>
              )}

              {pricingType === "custom_quote" && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm">
                    You will request a custom quote. The artist will provide a price, and you can approve or decline.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Payment Type *</Label>
                <Controller
                  name="paymentType"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advance" id="advance" />
                        <Label htmlFor="advance" className="cursor-pointer">Advance Payment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="full" id="full" />
                        <Label htmlFor="full" className="cursor-pointer">Full Payment</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              {paymentType === "advance" && (
                <div className="space-y-2">
                  <Label htmlFor="advancePercentage">Advance Percentage (%)</Label>
                  <Input
                    id="advancePercentage"
                    type="number"
                    min="0"
                    max="100"
                    defaultValue={50}
                    {...register("advancePercentage", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-gray-500">
                    Remaining amount will be paid after project completion
                  </p>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">Payment Security</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Payment held in platform escrow</li>
                  <li>• Released only after your approval</li>
                  <li>• Full refund if work not started</li>
                  <li>• Partial refund based on cancellation rules</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4 pt-4 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Booking Request"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}


