"use client";

import { FC, useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";

interface AlertModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal: FC<AlertModalProps> = ({
  title,
  isOpen,
  loading,
  onClose,
  onConfirm,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal
      title={title}
      desc="Цю дію буде неможливо повернути!"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex flex-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Відмінити
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Продовжити
        </Button>
      </div>
    </Modal>
  );
};
