"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "@/interface";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const PatientForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">
            Hi there
            <span className="animate-pulse ">👋</span>
          </h1>
          <p className="text-dark-700">Get started with appointments.</p>
        </section>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default PatientForm;
