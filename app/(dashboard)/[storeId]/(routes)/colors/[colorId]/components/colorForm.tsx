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
  value: z
    .string()
    .min(1, "Це поле обовязкове!")
    .regex(/^#/, "Значення має бути HEX кодом"),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
  colorData: Size | null;
}

export const ColorForm: FC<SizeFormProps> = ({ colorData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = colorData ? "Редагувати" : "Створити";
  const desc = colorData ? "Редагуйте поточний колір" : "Створіть новий колір";
  const toastMessage = colorData
    ? "Колір був оновлений"
    : "Новий колір був створений";
  const action = colorData ? "Зберегти" : "Створити";

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: colorData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: ColorFormValues) => {
    setLoading(true);

    try {
      if (colorData) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
      }
      toast.success(toastMessage);
      router.refresh();
      router.push(`/${params.storeId}/colors`);
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
      await axios.delete(`/api/${colorData?.id}/sizes/${params.colorId}`);
      setOpen(false);
      toast.success(
        `Ви успішно видалили розмір ${colorData?.name.toUpperCase()}, сторінка буде перезавантажена!`
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
        {colorData && (
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
                      placeholder="Назвіть колір"
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
                  <FormLabel>Значення (HEX code)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="Введіть значення (HEX)"
                        {...field}
                      />
                      <div
                        className="border rounded-full p-4 "
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
