import { SubmitBtn } from "@/components/formElements/SubmitBtn";
import FormInput from "@/components/formElements/FormInput";
import TextAreaInput from "@/components/formElements/TextArea";
import { createProduct, createInstructor } from "@/helpers/actions";
import FormContainer from "@/components/formElements/FormContainer";
import ImageInput from "@/components/formElements/ImageInput";

export default function CreatePage() {
  return (
    <section className="min-h-screen max-w-[600px] mx-auto w-full flex flex-col items-start gap-5 pt-20">
      <h2>Create content for passes products: </h2>

      <FormContainer action={createProduct} border={true}>
        <FormInput name="name" type="text" placeholder="enter name" />
        <TextAreaInput
          name="terms1"
          rows={2}
          placeholder="enter 1st line of terms for this type of product"
        />
        <TextAreaInput
          name="terms2"
          rows={2}
          placeholder="enter 2nd line of terms for this type of product"
          required={false}
        />
        <TextAreaInput
          name="terms3"
          rows={2}
          placeholder="enter 3rd line of terms for this type of product"
          required={false}
        />
        <FormInput name="price" type="number" placeholder="enter price (DKK)" />
        <SubmitBtn label="Create" />
      </FormContainer>

      <h2>Create content for instructors: </h2>

      <FormContainer action={createInstructor} border={true}>
        <FormInput name="name" type="text" placeholder="enter name" />
        <FormInput name="slug" type="text" placeholder="enter dance style" />
        <TextAreaInput
          name="bio1"
          rows={4}
          placeholder="enter 1st line of bio for this instructor"
        />
        <TextAreaInput
          name="bio2"
          rows={4}
          placeholder="enter 2nd line of bio for this instructor"
          required={false}
        />
        <TextAreaInput
          name="bio3"
          rows={4}
          placeholder="enter 3rd line of bio for this instructor"
          required={false}
        />
        <ImageInput placeholder="upload image for this instructor, max 5MB" />
        <FormInput
          name="instagram"
          type="text"
          placeholder="enter instagram url"
          required={false}
        />
        <FormInput
          name="youTube"
          type="text"
          placeholder="enter youtube url"
          required={false}
        />
        <SubmitBtn label="Create" />
      </FormContainer>
    </section>
  );
}
