"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleBack}
      className="flex items-center space-x-2"
    >
      <ChevronLeft className="h-5 w-5" />
    </Button>
  );
}
