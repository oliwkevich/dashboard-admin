"use client";

import { useStoreModal } from "@/hooks/useStoreModal";
import { useEffect } from "react";

export default function SetupPage() {
  const storeModal = useStoreModal();

  useEffect(() => {
    if (!storeModal.isOpen) {
      storeModal.onOpen();
    }
  }, [storeModal]);

  return null;
}
