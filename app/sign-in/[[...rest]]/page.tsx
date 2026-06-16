"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "@/components/theme-provider";

export default function SignInPage() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <SignIn appearance={resolvedTheme === "dark" ? dark : undefined} />
    </div>
  );
}
