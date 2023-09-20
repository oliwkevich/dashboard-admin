"use client";

import { Size } from "@prisma/client";
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

const formSchema = z.object({
  name: z.string().min(1, "Це поле обовязкове!"),
  value: z.string().min(1, "Це поле обовязкове!"),
});

type SizeFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
  sizeData: Size | null;
}

export const SizeForm: FC<SizeFormProps> = ({ sizeData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = sizeData ? "Редагувати" : "Створити";
  const desc = sizeData ? "Редагуйте поточний розмір" : "Створіть новий розмір";
  const toastMessage = sizeData
    ? "Розмір був оновлений"
    : "Новий розмір був створений";
  const action = sizeData ? "Зберегти" : "Створити";

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: sizeData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: SizeFormValues) => {
    setLoading(true);

    try {
      if (sizeData) {
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }
      toast.success(toastMessage);
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
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
      await axios.delete(`/api/${sizeData?.id}/sizes/${params.sizeId}`);
      setOpen(false);
      toast.success(
        `Ви успішно видалили розмір ${sizeData?.name.toUpperCase()}, сторінка буде перезавантажена!`
      );
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
    } catch (error) {
      toast.error("Перевірте перед видаленням, чи ви видалили всі продукти");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        title="Ви впевнені, що хочете видалити розмір?"
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} desc={desc} />
        {sizeData && (
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Назва</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Назвіть розмір"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Значення</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Введіть значення"
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
