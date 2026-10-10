"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function SchemeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    // Redirect to new /schemes/ route
    router.replace(`/schemes/${id}`);
  }, [id, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Redirecting...</p>
    </div>
  );
}
