"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomerProfile, useUpdateProfile } from "@/hooks/useCustomerHooks";
import { useEffect } from "react";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone is required"),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    country: z.string().min(1, "Country is required"),
  }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function CustomerProfilePage() {
  const { profile, loading: fetching } = useCustomerProfile();
  const { updateProfile, loading: updating } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile(data);
  };

  if (fetching) return <CustomerLayout>Loading...</CustomerLayout>;

  return (
    <CustomerLayout>
      <div className="max-w-2xl mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Address</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="street">Street</Label>
                    <Input id="street" {...register("address.street")} />
                    {errors.address?.street && <p className="text-sm text-red-500">{errors.address.street.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register("address.city")} />
                    {errors.address?.city && <p className="text-sm text-red-500">{errors.address.city.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" {...register("address.state")} />
                    {errors.address?.state && <p className="text-sm text-red-500">{errors.address.state.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input id="zipCode" {...register("address.zipCode")} />
                    {errors.address?.zipCode && <p className="text-sm text-red-500">{errors.address.zipCode.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" {...register("address.country")} />
                    {errors.address?.country && <p className="text-sm text-red-500">{errors.address.country.message}</p>}
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={updating}>
                {updating ? "Saving..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}
