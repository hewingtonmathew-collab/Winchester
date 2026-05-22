"use server";

export type ContactState = {
  success: boolean;
  message: string;
  errors: Partial<Record<"name" | "email" | "message", string>>;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function contactAction(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = ((formData.get("name") as string | null) ?? "").trim();
  const email = ((formData.get("email") as string | null) ?? "").trim();
  const organisation = ((formData.get("organisation") as string | null) ?? "").trim();
  const message = ((formData.get("message") as string | null) ?? "").trim();

  const errors: ContactState["errors"] = {};

  if (name.length < 2) {
    errors.name = "Please enter your full name (at least 2 characters).";
  }
  if (!emailRegex.test(email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (message.length < 10) {
    errors.message = "Please write a message of at least 10 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "", errors };
  }

  // TODO: wire up an email service (Resend, Mailgun, SendGrid, etc.) here
  // Example with Resend:
  //   import { Resend } from 'resend'
  //   const resend = new Resend(process.env.RESEND_API_KEY)
  //   await resend.emails.send({ from: '...', to: 'hello@winchesterconsultancy.co.uk', subject: '...', text: message })
  console.log("[Contact Form]", { name, email, organisation, message });

  return {
    success: true,
    message:
      "Thank you for getting in touch. We'll be in contact within one business day.",
    errors: {},
  };
}
