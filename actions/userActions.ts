"use server";

export type UserActionResult = {
  ok: boolean;
  error?: string;
};
export async function createUser(formData: FormData):Promise<UserActionResult> {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  // validate, hit DB / external API, etc.
  if (!email || !password) {
    return { ok: false, error: "Email and password are required" };
  }

  console.log("Creating user on server...", { email });
  return { ok: true };

}