import axiosInstances from "../axios";

export const addFile = async (formData: FormData) => {
  const response = await axiosInstances.instance.post(`upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const getFile = async (fileId: string) => {
  const response = await axiosInstances.instance.get(`file/${fileId}`);
  return response.data;
};

export const getAllFiles = async () => {
  const response = await axiosInstances.instance.get(`files`);
  return response.data;
};
