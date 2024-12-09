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

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);  // Track success message
    const [errorMessage, setErrorMessage] = useState('');

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

        setIsLoading(true); // Start loading
        setIsSuccess(false); // Reset success state
        setErrorMessage(''); // Clear error message

        console.log('Submitting the form...'); // Debug log

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

            console.log('Sending request to API...'); // Debug log

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

            console.log('Response received:', response); // Debug log

            setIsLoading(false); // Stop loading

            if (response.ok) {
                setIsSuccess(true); // Show success message
                reset();
                setPhotoFileName("");
                setCvFileName("");
                if (signaturePad) {
                    signaturePad.clear();
                }
                console.log('Form submitted successfully'); // Debug log
            } else {
                const error = await response.json();
                setErrorMessage(error.error || 'Something went wrong.');
                console.error('Error response:', error); // Debug log
            }
        } catch (error) {
            console.error("Error:", error);
            setIsLoading(false); // Stop loading
            setErrorMessage('An unexpected error occurred. Please try again.');
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
        <div className={`min-h-screen bg-purple-700 pt-[120px] pb-8 px-4  sm:px-8 lg:px-16 ${bubblegum.className}`}>
            <Card className="mx-auto max-w-4xl bg-white rounded-3xl shadow-lg ">
                <CardContent className="p-8">
                    <h1 className="text-4xl font-bold text-center mb-8 text-purple-100">
                        Nat&apos;Co Adventure Form
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="space-y-2">
                                <Label className="text-black font-medium">What is your LC?</Label>
                                <select
                                    {...register("lc")}
                                    className="border-2 border-purple rounded-lg focus:border-purple focus:ring-0 w-full"
                                >
                                    <option value="">Select your LC</option>
                                    <option value="Bardo">Bardo</option>
                                    <option value="Bizerte">Bizerte</option>
                                    <option value="Carthage">Carthage</option>
                                    <option value="Hadrumet">Hadrumet</option>
                                    <option value="Medina">Medina</option>
                                    <option value="Nabeul">Nabeul</option>
                                    <option value="Ruspina">Ruspina</option>
                                    <option value="Sfax">Sfax</option>
                                    <option value="Tacapes">Tacapes</option>
                                    <option value="Thyna">Thyna</option>
                                    <option value="University">University</option>
                                </select>
                                {errors.lc && <p className="text-red-500 text-sm">{errors.lc.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Full Name</Label>
                                <Input
                                    {...register("fullName")}
                                    className="border-2 border-purple rounded-lg focus:border-purple-700 focus:ring-0"
                                />
                                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Email Address</Label>
                                <Input
                                    type="email"
                                    {...register("email")}
                                    className="border-2 border-purple rounded-lg focus:border-purple-700 focus:ring-0"
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
                                                className="border-2 border-purple data-[state=checked]:bg-purple"
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
                                    className="border-2 border-purple rounded-lg focus:border-purple-700 focus:ring-0"
                                />
                                {errors.cin && <p className="text-red-500 text-sm">{errors.cin.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Phone Number</Label>
                                <Input
                                    {...register("phoneNumber")}
                                    className="border-2 border-purple rounded-lg focus:border-purple-700 focus:ring-0"
                                />
                                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Emergency Number</Label>
                                <Input
                                    {...register("emergencyNumber")}
                                    className="border-2 border-purple rounded-lg focus:border-purple-700 focus:ring-0"
                                />
                                {errors.emergencyNumber && <p className="text-red-500 text-sm">{errors.emergencyNumber.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Date of Birth</Label>
                                <Input
                                    type="date"
                                    {...register("dateOfBirth")}
                                    className="border-2 border-purple rounded-lg focus:border-purple-700 focus:ring-0"
                                />
                                {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black font-medium">Upload Your Photo</Label>
                                <div className="border-2 border-purple border-dashed rounded-lg p-4 text-center">
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
                                <div className="border-2 border-purple border-dashed rounded-lg p-4 text-center">
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
                                            <SelectTrigger className="border-2 border-purple rounded-lg focus:border-purple-700 focus:ring-0">
                                                <SelectValue placeholder="Select Key Area" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["Board of presidents", "OGV", "OGT", "IGV", "IGT", "Marketing", "TM", "F&L", "Pm&ewa", "IM", "BD&ewa"].map((area) => (
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
                                            <SelectTrigger className="border-2 border-purple rounded-lg focus:border-purple-700 focus:ring-0">
                                                <SelectValue placeholder="Select Position" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["Local committee president (current)", "Local committee president(elect)", "Vice president (current)", "Vice president(elect)", "Middle manager current", "Middle Manager selected", "Team member", "Newbie"].map((position) => (
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
                            <Label className="text-black font-medium">From which state are you?</Label>
                            <select
                                {...register("state")}
                                className="border-2 border-purple rounded-lg focus:border-purple-700 focus:ring-0 w-full"
                            >
                                <option value="" disabled>
                                    Select your state
                                </option>
                                {[
                                    "Tunis",
                                    "Ariana",
                                    "Ben Arous",
                                    "Mannouba",
                                    "Bizerte",
                                    "Nabeul",
                                    "Béja",
                                    "Jendouba",
                                    "Zaghouan",
                                    "Siliana",
                                    "Le Kef",
                                    "Sousse",
                                    "Monastir",
                                    "Mahdia",
                                    "Kasserine",
                                    "Sidi Bouzid",
                                    "Kairouan",
                                    "Gafsa",
                                    "Sfax",
                                    "Gabès",
                                    "Médenine",
                                    "Tozeur",
                                    "Kebili",
                                    "Ttataouine",
                                ].map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                            {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
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
                                                className="border-2 border-purple text-purple-700"
                                            />
                                            <Label>Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="no"
                                                className="border-2 border-purple text-purple-700"
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
                                className="border-2 border-purple rounded-lg focus:border-purple-700 focus:ring-0"
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
                                                className="border-2 border-purple text-purple-700"
                                            />
                                            <Label>Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="no"
                                                className="border-2 border-purple text-purple-700"
                                            />
                                            <Label>No</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                            {errors.chronicIllness && <p className="text-red-500 text-sm">{errors.chronicIllness.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center space-x-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="link" className="p-0 text-purple hover:text-purple">
                                            Indemnity Conditions
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-white rounded-lg p-6 max-w-2xl w-full sm:w-11/12 md:w-9/12 lg:w-8/12">
                                        <DialogHeader>
                                            <div className="flex justify-between items-center">
                                                <DialogTitle className="text-xl md:text-2xl font-bold text-purple">
                                                    Indemnity Conditions
                                                </DialogTitle>

                                            </div>
                                        </DialogHeader>
                                        <div className="text-sm text-gray-700 space-y-2 max-h-[70vh] overflow-y-auto">
                                            <p>As a Participant of the Conference, I hereby confirm that I shall act wisely and responsibly at all times during the conference and not harm the reputation or brand of AIESEC.</p>
                                            <ul className="list-disc pl-6 space-y-2">
                                                <li>I will comply with all applicable rules and regulations and other reasonable directions given by AIESEC or others.</li>
                                                <li>In case anything is broken at the room, reception, or bar... according to the person will be responsible for paying the damages.</li>
                                                <li>I agree to follow further instructions announced by AIESEC or the hotel security staff regarding my presence in the hotel and the safety of my stay.</li>
                                                <li>I hereby declare that if, during the period specified above, any of my actions directly or indirectly cause any kind of damage, or injury to an individual or if I participate in any illegal activities, I shall be personally responsible and liable for such actions and consequences.</li>
                                                <li>I ASSUME FULL RESPONSIBILITY for understanding and following the rules and security practices associated with NatCo 2K24 and for my safety.</li>
                                                <li>I agree on respecting Human Dignity and integrity.</li>
                                                <li>I agree that I belong to an entity that condemns sexual exploitation, abuse, and discrimination in all its forms.</li>
                                                <li>I assume all the responsibility if anybody raises an ethical complaint toward me, and I will follow all the procedures set by the (sub)committee responsible (Ethics/Harassment Prevention).</li>
                                                <li>I agree on reporting to the responsible (sub)committee (Ethics/Harassment Prevention) if I will ever witness or become subjected to any unwanted sexual behavior(s) inside the conference.</li>
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
                                            className="border-2 border-purple data-[state=checked]:bg-purple"
                                        />
                                    )}
                                />
                                <Label className="text-black font-medium">I agree to the Indemnity Conditions</Label>
                            </div>
                            {errors.agreeToIndemnity && <p className="text-sm text-red-500">{errors.agreeToIndemnity.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-black font-medium">Digital Signature</Label>
                            <div className="border-2 border-purple rounded-lg p-4">
                                <SignaturePad
                                    ref={(ref) => setSignaturePad(ref)}
                                    canvasProps={{
                                        className: "w-full h-40 border border-gray rounded"
                                    }}
                                    onEnd={handleSignatureEnd}
                                />
                                <div className="flex justify-end mt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="text-purple-700 border-purple-700 hover:bg-purple-50"
                                        onClick={() => signaturePad?.clear()}
                                    >
                                        Clear Signature
                                    </Button>
                                </div>
                            </div>
                            {errors.digitalSignature && <p className="text-sm text-red-500">{errors.digitalSignature.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-black font-medium">
                                If you had the chance to live in any planet, which one would it be?
                            </Label>
                            <Input
                                {...register("planetChoice")}
                                className="border-2 border-purple rounded-lg focus:border-purple-700 focus:ring-0"
                            />
                            {errors.planetChoice && <p className="text-red-500 text-sm">{errors.planetChoice.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-black font-medium">Why?</Label>
                            <Input
                                {...register("planetReason")}
                                className="border-2 border-purple rounded-lg focus:border-purple-700 focus:ring-0"
                            />
                            {errors.planetReason && <p className="text-red-500 text-sm">{errors.planetReason.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-black font-medium">
                                Have you ever considered launching your own business or startup?
                            </Label>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        value="yes"
                                        {...register("hasBusinessIdea")}
                                        className="border-2 border-purple focus:ring-purple-700"
                                    />
                                    <span>Yes</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        value="no"
                                        {...register("hasBusinessIdea")}
                                        className="border-2 border-purple focus:ring-purple-700"
                                    />
                                    <span>No</span>
                                </label>
                            </div>
                            {errors.hasBusinessIdea && (
                                <p className="text-red-500 text-sm">{errors.hasBusinessIdea.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-black font-medium">
                                Do you already have a business idea in mind? If yes, please describe.
                            </Label>
                            <Textarea
                                {...register("businessIdeaDetails")}
                                className="border-2 border-purple rounded-lg focus:border-purple-700 focus:ring-0"
                            />
                            {errors.businessIdeaDetails && (
                                <p className="text-red-500 text-sm">{errors.businessIdeaDetails.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-black font-medium">
                                What are you most looking forward to in the conference?
                            </Label>
                            <textarea
                                {...register("conferenceLookingForward")}
                                className="border-2 border-purple rounded-lg focus:border-purple-700 focus:ring-0 w-full h-20"
                            ></textarea>
                            {errors.conferenceLookingForward && (
                                <p className="text-red-500 text-sm">{errors.conferenceLookingForward.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-black font-medium">
                                What do you expect from the conference chair?
                            </Label>
                            <textarea
                                {...register("conferenceExpectations")}
                                className="border-2 border-purple rounded-lg focus:border-purple-700 focus:ring-0 w-full h-20"
                            ></textarea>
                            {errors.conferenceExpectations && (
                                <p className="text-red-500 text-sm">{errors.conferenceExpectations.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-black font-medium">What do you expect from FACI team and OC team?</Label>
                            <Textarea
                                {...register("expectations")}
                                className="border-2 border-purple rounded-lg focus:border-purple-700 focus:ring-0 min-h-[100px]"
                            />
                            {errors.expectations && <p className="text-sm text-red-500">{errors.expectations.message}</p>}
                        </div>



                        {/* Success or Error Popups */}
                        {isSuccess && (
                            <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 flex items-center justify-center  z-50 border-6">
                                <div className="p-6 bg-white border-2 border-purple rounded-lg flex flex-col">
                                    <p className="text-lg font-semibold">Your registration for NAT&apos;CO is done successfully!</p>
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="mt-4 px-4 py-2 bg-purple-700 text-white bg-purple rounded-md  align-center justify-center"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 flex items-center justify-center  z-50">
                                <div className="p-6 bg-white border-2 border-purple rounded-lg">
                                    <p className="text-lg font-semibold text-red-600">Please double check all fields are filled correctly!</p>
                                    <button
                                        onClick={() => setErrorMessage('')}
                                        className="mt-4 px-4 py-2 bg-purple-700 bg-purple text-white rounded-md"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Center the Submit Button */}
                        <div className="flex justify-center mt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-6 py-3 text-white bg-purple rounded-md ${isLoading ? 'opacity-20 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
