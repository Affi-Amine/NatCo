"use client"

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partnerFormSchema, PartnerFormData } from './partnerFormSchema';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

import { Bubblegum_Sans } from 'next/font/google'

const bubblegum = Bubblegum_Sans({ weight: '400', subsets: ['latin'] })

export default function PartnershipForm() {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<PartnerFormData>({
        resolver: zodResolver(partnerFormSchema),
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (data: PartnerFormData) => {
        console.log("Submitting form data:", data);
        setIsLoading(true);
        setIsSuccess(false);
        setErrorMessage('');

        try {
            const response = await fetch("/api/partnerAddToSheet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data }),
            });

            const result = await response.json();
            if (!response.ok) {
                setErrorMessage(result.error || "An unknown error occurred.");
            } else {
                setIsSuccess(true);
                reset();
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            setErrorMessage("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen bg-purple-200 pt-[120px] pb-8 px-4 sm:px-8 lg:px-20  ${bubblegum.className}`}>
            <Card className="mx-auto w-full max-w-lg sm:max-w-xl lg:max-w-4xl bg-white rounded-3xl shadow-lg">
                <CardContent className="p-6 sm:p-8 lg:p-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-8 lg:mb-12 text-purple-500">
                        Nat&apos;Co 2K24 Partnership Form
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="space-y-2">
                                <Label className="text-black font-medium">Company Name</Label>
                                <Input
                                    {...register("companyName")}
                                    placeholder="ex: HyperDev"
                                    className="border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-0"
                                />
                                {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Company Field</Label>
                                <Input
                                    {...register("companyField")}
                                    placeholder="ex: Business Consultancy"
                                    className="border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-0"
                                />
                                {errors.companyField && <p className="text-red-500 text-sm">{errors.companyField.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Company Size</Label>
                                <Controller
                                    name="companySize"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-0">
                                                <SelectValue placeholder="Select Company Size" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].map((size) => (
                                                    <SelectItem key={size} value={size}>
                                                        {size} employees
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.companySize && <p className="text-red-500 text-sm">{errors.companySize.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Company LinkedIn Profile</Label>
                                <Input
                                    {...register("linkedinProfile")}
                                    placeholder="ex: https://www.linkedin.com/company/hyperdev"
                                    className="border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-0"
                                />
                                {errors.linkedinProfile && <p className="text-red-500 text-sm">{errors.linkedinProfile.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Company Website</Label>
                                <Input
                                    {...register("website")}
                                    placeholder="If you don't have a website, Write N/A"
                                    className="border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-0"
                                />
                                {errors.website && <p className="text-red-500 text-sm">{errors.website.message}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-black font-medium">
                                    Why is your company interested in partnering with NatCo 2K24?
                                </Label>
                                <Textarea
                                    {...register("partnershipReason")}
                                    placeholder="Let us know more"
                                    className="border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-0 min-h-[100px]"
                                />
                                {errors.partnershipReason && <p className="text-red-500 text-sm">{errors.partnershipReason.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Contact Person Name</Label>
                                <Input
                                    {...register("contactName")}
                                    placeholder="ex: Amine Affi"
                                    className="border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-0"
                                />
                                {errors.contactName && <p className="text-red-500 text-sm">{errors.contactName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Contact Person Email</Label>
                                <Input
                                    {...register("contactEmail")}
                                    placeholder="affi.amin.work@gmail.com"
                                    className="border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-0"
                                />
                                {errors.contactEmail && <p className="text-red-500 text-sm">{errors.contactEmail.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Contact Person Mobile Number</Label>
                                <Input
                                    {...register("contactPhone")}
                                    placeholder="ex: 28108923"
                                    className="border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-0"
                                />
                                {errors.contactPhone && <p className="text-red-500 text-sm">{errors.contactPhone.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Contact Person Position in the organization</Label>
                                <Input
                                    {...register("contactPosition")}
                                    placeholder="ex: Business Development Manager"
                                    className="border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-0"
                                />
                                {errors.contactPosition && <p className="text-red-500 text-sm">Please double check all fields are filled correctly!</p>}
                            </div>
                        </div>
                        {/* Success or Error Popups */}
                        {isSuccess && (
                            <div className="fixed inset-0 flex items-center justify-center z-50">
                                <div className="p-6 bg-white border-2 border-pink-300 rounded-lg flex flex-col">
                                    <p className="text-lg font-semibold">Your registration for NAT&apos;CO is done successfully!</p>
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-md"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="fixed inset-0 flex items-center justify-center z-50">
                                <div className="p-6 bg-white border-2 border-pink-300 rounded-lg flex flex-col">
                                    <p className="text-lg font-semibold text-red-600">{errorMessage}</p>
                                    <button
                                        onClick={() => setErrorMessage('')}
                                        className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-md"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-black ${isLoading ? 'opacity-50' : 'hover:bg-purple-600'} text-white rounded-lg py-2 sm:py-3 lg:py-4 text-base sm:text-lg lg:text-xl`}
                        >
                            {isLoading ? "Submitting..." : "Submit Partnership Request"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

