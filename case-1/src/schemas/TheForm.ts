import z, { ZodError } from 'zod';

export const FormSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  selectedObject: z.string(),
});

export type FormSchema = z.infer<typeof FormSchema>;
export type FormFields = keyof FormSchema;
export type FormFieldErrors = {
  [key in FormFields]?: string;
};

export function getFieldError<T extends FormFields, K extends FormSchema[T]>(
  property: T,
  value: K
) {
  const { error } = FormSchema.shape[property].safeParse(value);
  return error
    ? error.issues.map((issue) => issue.message).join(', ')
    : undefined;
}

export const getErrors = (error: ZodError) =>
  error.issues.reduce((all, issue) => {
    const path = issue.path.join('') as keyof FormSchema;
    const message = all[path] ? all[path] + ', ' : '';
    all[path] = message + issue.message;
    return all;
  }, {} as FormFieldErrors);