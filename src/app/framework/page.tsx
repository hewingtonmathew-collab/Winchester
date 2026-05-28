import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "GuardianOS Framework | SafeShield",
};

export default function FrameworkPage() {
  redirect("/guardian-os");
}
