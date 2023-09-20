"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { AlertModal } from "@/components/modals/alertModal";
import { ProductColumn } from "./columns";

export const CellAction = ({ data }: { data: ProductColumn }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  const onCopy = () => {
    navigator.clipboard.writeText(data.id);
    toast.success("ID товару було скопійовано!");
  };

  const onEdit = () => {
    router.push(`/${params.storeId}/products/${data.id}`);
  };

  const onRemove = async () => {
    setLoading(true);

    try {
      await axios.delete(`/api/${params?.storeId}/products/${data.id}`);
      toast.success(
        `Ви успішно видалили товар ${data?.name.toUpperCase()}, сторінка будет перезавантажена!`
      );
      router.refresh();
    } catch (error) {
      toast.error("Перевірте перед видаленням, чи ви видалили всі категорії");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onRemove}
        title="Ви точно хочете видалити Товар?"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant="ghost">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Дії</DropdownMenuLabel>
          <DropdownMenuItem disabled={loading} onClick={onCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Копіювати ID
          </DropdownMenuItem>
          <DropdownMenuItem disabled={loading} onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Редагувати
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={loading}
            onClick={() => setOpen(true)}
            className="text-rose-100 bg-red-400"
          >
            <Trash className="w-4 h-4 mr-2" />
            Видалити
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
