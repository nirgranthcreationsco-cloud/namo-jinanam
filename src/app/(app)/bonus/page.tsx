"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BonusRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/sankalp");
  }, [router]);

  return null;
}
