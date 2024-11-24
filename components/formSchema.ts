import * as z from 'zod';

export const formSchema = z.object({
  lc: z.string().min(1, { message: "LC is required" }),
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  shareInfo: z.boolean(),
  cin: z.string().min(1, { message: "CIN is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  emergencyNumber: z.string().min(1, { message: "Emergency number is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  photo: z.any(),
  cv: z.any(),
  keyArea: z.string().min(1, { message: "Key Area is required" }),
  position: z.string().min(1, { message: "Position is required" }),
  allergies: z.enum(["yes", "no"]),
  allergiesDetails: z.string().optional(),
  chronicIllness: z.enum(["yes", "no"]),
  expectations: z.string().min(1, { message: "Expectations are required" }),
  agreeToIndemnity: z.boolean().refine(val => val === true, {
    message: "You must agree to the Indemnity Conditions"
  }),
  digitalSignature: z.string().min(1, { message: "Digital signature is required" }),
});

export type FormData = z.infer<typeof formSchema>;

