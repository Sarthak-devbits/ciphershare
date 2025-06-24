import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const uploadToCloudinary = async (blob: Blob) => {
  const formData = new FormData();
  formData.append('file', blob);
  formData.append('upload_preset', 'securevault_unsigned'); // use your actual preset name

  const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    method: 'POST',
    body: formData
  });

  const cloudJson = await cloudRes.json();
  return cloudJson.secure_url; // or cloudJson.url if you prefer
};