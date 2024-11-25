import * as z from 'zod';

export const partnerFormSchema = z.object({
  companyName: z.string().min(1, { message: "Company Name is required" }),
  companyField: z.string().min(1, { message: "Company Field is required" }),
  companySize: z.string().min(1, { message: "Company Size is required" }),
  linkedinProfile: z.string().url({ message: "Invalid LinkedIn URL" }),
  website: z.string().url({ message: "Invalid website URL" }).or(z.literal("N/A")),
  partnershipReason: z.string().min(1, { message: "Please provide a reason for partnership" }),
  contactName: z.string().min(1, { message: "Contact Person Name is required" }),
  contactEmail: z.string().email({ message: "Invalid email address" }),
  contactPhone: z.string().min(8, { message: "Invalid phone number" }),
  contactPosition: z.string().min(1, { message: "Contact Person Position is required" }),
});

export type PartnerFormData = z.infer<typeof partnerFormSchema>;

