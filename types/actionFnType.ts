export type ActionFnType = (
  prevState: { errorMessage?: string; successMessage?: string },
  formData: FormData
) => Promise<{ errorMessage?: string; successMessage?: string }>;