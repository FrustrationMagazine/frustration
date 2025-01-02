export type FormSubmissionStatus = {
  success: string | null;
  error: string | null;
};

export const toFormData = (data: any): FormData => {
  const formData = new FormData();
  const fields = Object.keys(data);
  fields.forEach((field) => formData.append(field, data[field]));
  return formData;
};
