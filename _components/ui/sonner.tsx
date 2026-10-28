"use client"

import { useTheme } from "@/_components/theme-provider"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"
import { useMemo } from "react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()
  const currentTheme = theme === "system" ? "system" : theme

  const style = useMemo(
    () =>
      ({
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)",
      }) as React.CSSProperties,
    []
  )

  const toastOptions = useMemo(
    () => ({
      classNames: {
        toast: "cn-toast",
        title: "cn-toast-title",
        description: "cn-toast-description",
        actionButton: "cn-toast-action-button",
        cancelButton: "cn-toast-cancel-button",
      },
    }),
    []
  )

  return (
    <Sonner
      theme={currentTheme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={style}
      toastOptions={toastOptions}
      {...props}
    />
  )
}

export { Toaster }
