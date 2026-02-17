import { SubmitBtn } from "@/components/formElements/SubmitBtn";
import FormInput from "@/components/formElements/FormInput";
import TextAreaInput from "@/components/formElements/TextArea";
import { createCMSAction } from "@/helpers/actions";
import FormContainer from "@/components/formElements/FormContainer";

export default function CreatePage() {
  return (
    <section className="min-h-screen max-w-[600px] w-full flex flex-col items-start gap-5 pt-20">
      <h2>Create content for passes products: </h2>
      {/*  <form
        className="flex flex-col gap-5 border-[0.5px] p-5 rounded-md w-full"
        action={createCMSAction}
      >
        <FormInput name="name" type="text" placeholder="enter name" />
        <TextAreaInput
          name="terms"
          placeholder="enter terms for this type of product (fx: 1. no refunds, 2. valid for 1 year, 3. can be transferred)"
        />
        <FormInput name="price" type="number" placeholder="enter price (DKK)" />
        <SubmitBtn label="Create" />
      </form> */}
      <FormContainer action={createCMSAction}>
        <FormInput name="name" type="text" placeholder="enter name" />
        <TextAreaInput
          name="terms1"
          rows={2}
          placeholder="enter 1st line of terms for this type of product)"
        />
        <TextAreaInput
          name="terms2"
          rows={2}
          placeholder="enter 2nd line of terms for this type of product)"
        />
        <TextAreaInput
          name="terms3"
          rows={2}
          placeholder="enter 3rd line of terms for this type of product)"
        />
        <FormInput name="price" type="number" placeholder="enter price (DKK)" />
        <SubmitBtn label="Create" />
      </FormContainer>
    </section>
  );
}
