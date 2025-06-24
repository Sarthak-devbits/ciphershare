import axiosInstances from "../axios";

export const addFile = async (formData: FormData) => {
  const response = await axiosInstances.instance.post(`upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};
