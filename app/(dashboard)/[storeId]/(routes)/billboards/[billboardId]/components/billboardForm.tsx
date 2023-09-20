"use client";

import { Billboard } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertModal } from "@/components/modals/alertModal";
import { ImageUpload } from "@/components/ui/imageUpload";

const formSchema = z.object({
  label: z.string().min(1, "Це поле обовязкове!"),
  imageUrl: z.string().min(1, "Це поле обовязкове!"),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
  billboardData: Billboard | null;
}

export const BillboardForm: FC<BillboardFormProps> = ({ billboardData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = billboardData ? "Редагувати" : "Створити";
  const desc = billboardData
    ? "Редагуйте поточну дошку"
    : "Створіть свою нову дошку";
  const toastMessage = billboardData
    ? "Дошка була оновлена"
    : "Нова дошка була створена";
  const action = billboardData ? "Зберегти" : "Створити";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: billboardData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    setLoading(true);

    try {
      if (billboardData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      toast.success(toastMessage);
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
    } catch (error) {
      console.log("error", error);
      toast.error("Упс... Щось пішло не так, спробуйте пізніше");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setLoading(true);

    try {
      await axios.delete(
        `/api/${billboardData?.id}/billboards/${params.billboardId}`
      );
      setOpen(false);
      toast.success(
        `Ви успішно видалили дошку ${billboardData?.label.toUpperCase()}, сторінка будет перезавантажена!`
      );
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
    } catch (error) {
      toast.error("Перевірте перед видаленням, чи ви видалили всі категорії");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        title="Ви впевнені, що хочете видалити магазин?"
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} desc={desc} />
        {billboardData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="w-4 h-4 " />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Зображення для заднього фону</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Назва</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Назвіть свою дошку"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} type="submit" className="ml-auto">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
