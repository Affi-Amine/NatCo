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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from 'lucide-react'
import { Bubblegum_Sans } from 'next/font/google'

const bubblegum = Bubblegum_Sans({ weight: '400', subsets: ['latin'] })

export default function SpacetoonForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <div className={`min-h-screen bg-pink-300 p-8 flex items-center justify-center ${bubblegum.className}`}>
      <Card className="mx-auto max-w-4xl">
        <CardHeader className="space-y-1 bg-primary text-primary-foreground">
          <CardTitle className="text-center text-2xl">Registration Form</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lc">What is your LC?</Label>
                <Input id="lc" {...register("lc")} className="mt-1 block w-full rounded-lg border-2 border-pink-500 focus:border-pink-700 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition duration-300 ease-in-out" />
                {errors.lc && <p className="text-sm text-destructive">{errors.lc.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" {...register("fullName")} className="mt-1 block w-full rounded-lg border-2 border-pink-500 focus:border-pink-700 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition duration-300 ease-in-out" />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" {...register("email")} className="mt-1 block w-full rounded-lg border-2 border-pink-500 focus:border-pink-700 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition duration-300 ease-in-out" />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  name="shareInfo"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shareInfo"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor="shareInfo">Share personal info with partners</Label>
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cin">CIN</Label>
                <Input id="cin" {...register("cin")} className="mt-1 block w-full rounded-lg border-2 border-pink-500 focus:border-pink-700 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition duration-300 ease-in-out" />
                {errors.cin && <p className="text-sm text-destructive">{errors.cin.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" {...register("phoneNumber")} className="mt-1 block w-full rounded-lg border-2 border-pink-500 focus:border-pink-700 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition duration-300 ease-in-out" />
                {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyNumber">Emergency Number</Label>
                <Input id="emergencyNumber" {...register("emergencyNumber")} className="mt-1 block w-full rounded-lg border-2 border-pink-500 focus:border-pink-700 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition duration-300 ease-in-out" />
                {errors.emergencyNumber && <p className="text-sm text-destructive">{errors.emergencyNumber.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} className="mt-1 block w-full rounded-lg border-2 border-pink-500 focus:border-pink-700 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition duration-300 ease-in-out" />
                {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Upload Your Photo</Label>
                <div className="flex items-center justify-center w-full">
                  <label className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-pink-500 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground">Size limit: 10 MB</p>
                    </div>
                    <input type="file" className="hidden" {...register("photo")} accept="image/*" />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload Your CV</Label>
                <div className="flex items-center justify-center w-full">
                  <label className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-pink-500 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground">Size limit: 10 MB</p>
                    </div>
                    <input type="file" className="hidden" {...register("cv")} accept=".pdf,.doc,.docx" />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Key Area</Label>
                <Controller
                  name="keyArea"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full rounded-lg border-2 border-pink-500 focus:border-pink-700 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition duration-300 ease-in-out">
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
                {errors.keyArea && <p className="text-sm text-destructive">{errors.keyArea.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Position</Label>
                <Controller
                  name="position"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full rounded-lg border-2 border-pink-500 focus:border-pink-700 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition duration-300 ease-in-out">
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
                {errors.position && <p className="text-sm text-destructive">{errors.position.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Do you have any allergies?</Label>
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
                      <RadioGroupItem value="yes" id="allergies-yes" />
                      <Label htmlFor="allergies-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="allergies-no" />
                      <Label htmlFor="allergies-no">No</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.allergies && <p className="text-sm text-destructive">{errors.allergies.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergiesDetails">If yes, mention it</Label>
              <Input id="allergiesDetails" {...register("allergiesDetails")} className="mt-1 block w-full rounded-lg border-2 border-pink-500 focus:border-pink-700 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition duration-300 ease-in-out" />
            </div>

            <div className="space-y-2">
              <Label>Do you have any chronic illness?</Label>
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
                      <RadioGroupItem value="yes" id="chronicIllness-yes" />
                      <Label htmlFor="chronicIllness-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="chronicIllness-no" />
                      <Label htmlFor="chronicIllness-no">No</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.chronicIllness && <p className="text-sm text-destructive">{errors.chronicIllness.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectations">What do you expect from FACI team and OC team?</Label>
              <Textarea id="expectations" {...register("expectations")} className="mt-1 block w-full rounded-lg border-2 border-pink-500 focus:border-pink-700 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition duration-300 ease-in-out" />
              {errors.expectations && <p className="text-sm text-destructive">{errors.expectations.message}</p>}
            </div>

            <Button type="submit" className="w-full">
              Submit Registration
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

