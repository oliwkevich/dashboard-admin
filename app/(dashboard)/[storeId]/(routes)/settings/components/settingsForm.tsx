"use client";

import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
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
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alertModal";
import { ApiAlert } from "@/components/ui/apiAlert";
import { useOrigin } from "@/hooks/useOrigin";

interface SettingsFormProps {
  storeDate: Store;
}

const formSchema = z.object({
  name: z.string().min(1, "Це поле обовязкове!"),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: FC<SettingsFormProps> = ({ storeDate }) => {
  const origin = useOrigin();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: storeDate,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    setLoading(true);

    try {
      await axios.patch(`/api/stores/${storeDate.id}`, data);
      toast.success("Дані магазину успішно оновлені!");
      router.refresh();
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
      await axios.delete(`/api/stores/${storeDate.id}`);
      setOpen(false);
      toast.error(
        `Ви успішно видалили магазин ${storeDate.name.toUpperCase()}, сторінка будет перезавантажена!`
      );
      router.refresh();
      router.push("/");
    } catch (error) {
      toast.error(
        "Провірьте чи перед видаленням, ви видалили всі продукти та категорії"
      );
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
        <Heading
          title="Налаштування"
          desc="Керування налаштуваннями магазину"
        />
        <Button
          disabled={loading}
          variant="destructive"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <Trash className="w-4 h-4 " />
        </Button>
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
                      placeholder="Назва магазину"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} type="submit" className="ml-auto">
            Зберегти
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        desc={`${origin}/api/${storeDate.id}`}
        variant="public"
      />
    </>
  );
};
