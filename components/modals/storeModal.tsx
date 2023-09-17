"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

import { useStoreModal } from "@/hooks/useStoreModal";
import { Modal } from "../ui/modal";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1, "Це поле обовязкове!"),
});

export const StoreModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const storeModal = useStoreModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const response = await axios.post("api/stores", values);
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast.error(
        "Упс... щось пішло не так. Спробуйте ще раз, або повторіть спробу пізніше."
      );
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Створити магазин"
      desc="Створіть новий магазин для керування вашими продуктами та категоріями"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Назва*</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="E-Commerce"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                disabled={isLoading}
                variant="outline"
                onClick={storeModal.onClose}
                type="button"
              >
                Відмінити
              </Button>
              <Button disabled={isLoading} type="submit">
                Продовжити
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
