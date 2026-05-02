import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getErrorMessage = (error: unknown, defaultMessage: string = "An unknown error occurred."): string => {
  console.log("Error:", error);
  let errorMessage = defaultMessage;
  if (error instanceof Error && error.message.length < 100) {
    errorMessage = error.message;
  }
  return errorMessage;
}