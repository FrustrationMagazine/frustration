export type FormSubmissionStatus = {
  successMessage: string | null;
  errorMessage: string | null;
};

export const convertDataToFormData = (data: any): FormData => {
  const formData = new FormData();
  const fields = Object.keys(data);
  fields.forEach((field) => formData.append(field, data[field]));
  return formData;
};
