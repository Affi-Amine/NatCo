"use client"

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormData } from './formSchema';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload } from 'lucide-react'

import { Bubblegum_Sans } from 'next/font/google'

const bubblegum = Bubblegum_Sans({ weight: '400', subsets: ['latin'] })

export default function RegistrationForm() {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const [photoFileName, setPhotoFileName] = React.useState<string>('');
    const [cvFileName, setCvFileName] = React.useState<string>('');

    const onSubmit = async (data: FormData) => {
        const encodeFileToBase64 = (file: File): Promise<string> =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.result) {
                        resolve(reader.result.toString().split(",")[1]); // Safely access `reader.result`
                    } else {
                        reject(new Error("File reading failed."));
                    }
                };
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
            });

        try {
            const photoFileInput = document.getElementById("photo-upload") as HTMLInputElement | null;
            const cvFileInput = document.getElementById("cv-upload") as HTMLInputElement | null;

            if (!photoFileInput || !cvFileInput) {
                throw new Error("File input elements not found.");
            }

            const photoFile = photoFileInput.files?.[0];
            const cvFile = cvFileInput.files?.[0];

            const photoBase64 = photoFile ? await encodeFileToBase64(photoFile) : null;
            const cvBase64 = cvFile ? await encodeFileToBase64(cvFile) : null;

            const response = await fetch("/api/addToSheet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    data,
                    photoFile: photoFile
                        ? { name: photoFile.name, type: photoFile.type, base64: photoBase64 }
                        : null,
                    cvFile: cvFile
                        ? { name: cvFile.name, type: cvFile.type, base64: cvBase64 }
                        : null,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message); // Success message
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`); // Error message
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFileName(file.name);
        }
    };

    const handleCVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCvFileName(file.name);
        }
    };

    return (
        <div className={`min-h-screen bg-pink-200 p-8 ${bubblegum.className}`}>
            <Card className="mx-auto max-w-4xl bg-white rounded-3xl shadow-lg">
                <CardContent className="p-8">
                    <h1 className="text-4xl font-bold text-center mb-8 text-pink-500">
                        Spacetoon Adventure Form
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="space-y-2">
                                <Label className="text-black font-medium">What is your LC?</Label>
                                <Input
                                    {...register("lc")}
                                    className="border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Full Name</Label>
                                <Input
                                    {...register("fullName")}
                                    className="border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Email Address</Label>
                                <Input
                                    type="email"
                                    {...register("email")}
                                    className="border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-0"
                                />
                            </div>

                            <div className="flex items-center space-x-2 self-end">
                                <Controller
                                    name="shareInfo"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="border-2 border-pink-300 data-[state=checked]:bg-pink-500"
                                            />
                                            <Label className="text-black font-medium">Share personal info with partners</Label>
                                        </div>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">CIN</Label>
                                <Input
                                    {...register("cin")}
                                    className="border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Phone Number</Label>
                                <Input
                                    {...register("phoneNumber")}
                                    className="border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Emergency Number</Label>
                                <Input
                                    {...register("emergencyNumber")}
                                    className="border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Date of Birth</Label>
                                <Input
                                    type="date"
                                    {...register("dateOfBirth")}
                                    className="border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Upload Your Photo</Label>
                                <div className="border-2 border-pink-300 border-dashed rounded-lg p-4 text-center">
                                    <label htmlFor="photo-upload" className="cursor-pointer">
                                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500">
                                            {photoFileName || "Click to upload or drag and drop"}
                                        </p>
                                        <p className="text-xs text-gray-400">Size limit: 10 MB</p>
                                    </label>
                                    <input
                                        id="photo-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePhotoChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Upload Your CV</Label>
                                <div className="border-2 border-pink-300 border-dashed rounded-lg p-4 text-center">
                                    <label htmlFor="cv-upload" className="cursor-pointer">
                                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500">
                                            {cvFileName || "Click to upload or drag and drop"}
                                        </p>
                                        <p className="text-xs text-gray-400">Size limit: 10 MB</p>
                                    </label>
                                    <input
                                        id="cv-upload"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className="hidden"
                                        onChange={handleCVChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Key Area</Label>
                                <Controller
                                    name="keyArea"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-0">
                                                <SelectValue placeholder="Select Key Area" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["Board of presidents", "OGV", "OGT", "IGV", "IGT", "BD", "Marketing", "TM", "F&L", "PM&EwA"].map((area) => (
                                                    <SelectItem key={area} value={area}>{area}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Position</Label>
                                <Controller
                                    name="position"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-0">
                                                <SelectValue placeholder="Select Position" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["Local committee president (current)", "Local committee president(elect)", "Vice president (current)", "Vice president(elect)", "Middle manager", "Team member", "Newbie"].map((position) => (
                                                    <SelectItem key={position} value={position}>{position}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-black font-medium">Do you have any allergies?</Label>
                            <Controller
                                name="allergies"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex space-x-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="yes"
                                                className="border-2 border-pink-300 text-pink-500"
                                            />
                                            <Label>Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="no"
                                                className="border-2 border-pink-300 text-pink-500"
                                            />
                                            <Label>No</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-black font-medium">If yes, mention it</Label>
                            <Input
                                {...register("allergiesDetails")}
                                className="border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-black font-medium">Do you have any chronic illness?</Label>
                            <Controller
                                name="chronicIllness"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex space-x-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="yes"
                                                className="border-2 border-pink-300 text-pink-500"
                                            />
                                            <Label>Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="no"
                                                className="border-2 border-pink-300 text-pink-500"
                                            />
                                            <Label>No</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-black font-medium">What do you expect from FACI team and OC team?</Label>
                            <Textarea
                                {...register("expectations")}
                                className="border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-0 min-h-[100px]"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                        >
                            Submit
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

