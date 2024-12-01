"use client"

import React, { useState } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import SignaturePad from 'react-signature-canvas'

import { Bubblegum_Sans } from 'next/font/google'

const bubblegum = Bubblegum_Sans({ weight: '400', subsets: ['latin'] })

export default function RegistrationForm() {
    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const [photoFileName, setPhotoFileName] = useState<string>('');
    const [cvFileName, setCvFileName] = useState<string>('');
    const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);

    const onSubmit = async (data: FormData) => {
        const encodeFileToBase64 = (file: File): Promise<string> =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.result) {
                        resolve(reader.result.toString().split(",")[1]);
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
            const digitalSignature = data.digitalSignature; // Signature data from SignaturePad

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
                    digitalSignature: digitalSignature
                        ? { name: "digital-signature.png", type: "image/png", base64: digitalSignature.split(",")[1] }
                        : null,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                reset();
                setPhotoFileName("");
                setCvFileName("");
                if (signaturePad) {
                    signaturePad.clear();
                }
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
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

    const handleSignatureEnd = () => {
        if (signaturePad) {
            const signatureData = signaturePad.toDataURL();
            setValue('digitalSignature', signatureData);
        }
    };

    return (
        <div className={`min-h-screen bg-pink-200 pt-[120px] pb-8 px-4 sm:px-8 lg:px-16 ${bubblegum.className}`}>
            <Card className="mx-auto max-w-4xl bg-white rounded-3xl shadow-lg">
                <CardContent className="p-8">
                    <h1 className="text-4xl font-bold text-center mb-8 text-pink-500">
                        NatCo Adventure Form
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="space-y-2">
                                <Label className="text-black font-medium">What is your LC?</Label>
                                <Input
                                    {...register("lc")}
                                    className="border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-0"
                                />
                                {errors.lc && <p className="text-red-500 text-sm">{errors.lc.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Full Name</Label>
                                <Input
                                    {...register("fullName")}
                                    className="border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-0"
                                />
                                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Email Address</Label>
                                <Input
                                    type="email"
                                    {...register("email")}
                                    className="border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-0"
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
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
                                {errors.cin && <p className="text-red-500 text-sm">{errors.cin.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Phone Number</Label>
                                <Input
                                    {...register("phoneNumber")}
                                    className="border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-0"
                                />
                                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Emergency Number</Label>
                                <Input
                                    {...register("emergencyNumber")}
                                    className="border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-0"
                                />
                                {errors.emergencyNumber && <p className="text-red-500 text-sm">{errors.emergencyNumber.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Date of Birth</Label>
                                <Input
                                    type="date"
                                    {...register("dateOfBirth")}
                                    className="border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-0"
                                />
                                {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>}
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
                                        {...register("photo")}
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
                                        {...register("cv")}
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
                                {errors.keyArea && <p className="text-red-500 text-sm">{errors.keyArea.message}</p>}
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
                                {errors.position && <p className="text-red-500 text-sm">{errors.position.message}</p>}
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
                            {errors.allergies && <p className="text-
red-500 text-sm">{errors.allergies.message}</p>}
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
                            {errors.chronicIllness && <p className="text-red-500 text-sm">{errors.chronicIllness.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="link" className="p-0 text-pink-500 hover:text-pink-600">
                                            Indemnity Conditions
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-white rounded-lg p-6 max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-bold text-pink-500 mb-4">Indemnity Conditions</DialogTitle>
                                        </DialogHeader>
                                        <div className="text-sm text-gray-700 space-y-2">
                                            <p>As a Participant of the Conference, I hereby confirm that I shall act wisely and responsibly at all times during the conference and not harm the reputation or brand of AIESEC.</p>
                                            <ul className="list-disc pl-6 space-y-2">
                                                <li>
                                                    I will comply with all applicable rules and regulations and other reasonable directions given by AIESEC or others.
                                                </li>
                                                <li>
                                                    In case anything is broken at the room, reception, or bar... according to the person will be responsible for paying the damages.
                                                </li>
                                                <li>
                                                    I agree to follow further instructions announced by AIESEC or the hotel security staff regarding my presence in the hotel and the safety of my stay.
                                                </li>
                                                <li>
                                                    I hereby declare that if, during the period specified above, any of my actions directly or indirectly cause any kind of damage, or injury to an individual or if I participate in any illegal activities, I shall be personally responsible and liable for such actions and consequences.
                                                </li>
                                                <li>
                                                    I ASSUME FULL RESPONSIBILITY for understanding and following the rules and security practices associated with NatCo 2K24 and for my safety.
                                                </li>
                                                <li>
                                                    I agree on respecting Human Dignity and integrity.
                                                </li>
                                                <li>
                                                    I agree that I belong to an entity that condemns sexual exploitation, abuse, and discrimination in all its forms.
                                                </li>
                                                <li>
                                                    I assume all the responsibility if anybody raises an ethical complaint toward me, and I will follow all the procedures set by the (sub)committee responsible (Ethics/Harassment Prevention).
                                                </li>
                                                <li>
                                                    I agree on reporting to the responsible (sub)committee (Ethics/Harassment Prevention) if I will ever witness or become subjected to any unwanted sexual behavior(s) inside the conference.
                                                </li>
                                            </ul>
                                            <p className="font-bold mt-4">
                                                I ACKNOWLEDGE that I have read and understood this agreement, that I appreciate and accept these risks associated with NatCo 2K24, and that I have executed this agreement voluntarily.
                                            </p>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <Controller
                                    name="agreeToIndemnity"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="border-2 border-pink-300 data-[state=checked]:bg-pink-500"
                                        />
                                    )}
                                />
                                <Label className="text-black font-medium">I agree to the Indemnity Conditions</Label>
                            </div>
                            {errors.agreeToIndemnity && <p className="text-sm text-red-500">{errors.agreeToIndemnity.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-black font-medium">Digital Signature</Label>
                            <div className="border-2 border-pink-300 rounded-lg p-4">
                                <SignaturePad
                                    ref={(ref) => setSignaturePad(ref)}
                                    canvasProps={{
                                        className: "w-full h-40 border border-gray-300 rounded"
                                    }}
                                    onEnd={handleSignatureEnd}
                                />
                                <div className="flex justify-end mt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="text-pink-500 border-pink-500 hover:bg-pink-50"
                                        onClick={() => signaturePad?.clear()}
                                    >
                                        Clear Signature
                                    </Button>
                                </div>
                            </div>
                            {errors.digitalSignature && <p className="text-sm text-red-500">{errors.digitalSignature.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-black font-medium">What do you expect from FACI team and OC team?</Label>
                            <Textarea
                                {...register("expectations")}
                                className="border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-0 min-h-[100px]"
                            />
                            {errors.expectations && <p className="text-sm text-red-500">{errors.expectations.message}</p>}
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
