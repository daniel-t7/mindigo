"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "@/_components/theme-provider";

export default function SignUpPage() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <SignUp appearance={resolvedTheme === "dark" ? dark : undefined} />
    </div>
  );
}
