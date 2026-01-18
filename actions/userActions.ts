"use server";

export async function createUser(formData: FormData):Promise<void> {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  // validate, hit DB / external API, etc.
  console.log("Creating user on server...", { email });

}