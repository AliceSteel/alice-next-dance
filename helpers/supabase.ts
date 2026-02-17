import { createClient } from "@supabase/supabase-js";

const bucketName = "images-bucket";

export const supabase = createClient(
  process.env.SUPABASE_URL || "" as string,
  process.env.SUPABASE_KEY || "" as string
);

export const uploadImageToSupabase = async (file: File) => {
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;

    const { data} = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
            cacheControl: "3600",
        });

    if (!data) {
        throw new Error("No data returned from Supabase after upload");
    }
    const publicUrl = supabase.storage.from(bucketName).getPublicUrl(fileName).data.publicUrl;
    return publicUrl;
};
