import * as z from 'zod';

export const SignUpValidation = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  username: z.string().min(4, {
    message: 'Username must be at least 4 characters.',
  }),
  fullName: z.string().min(4, {
    message: 'Full Name must be at least 4 characters.',
  }),
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters.',
    })
    .max(20, {
      message: "Password can't be longer than 20 characters",
    }),
});

export const SignInValidation = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters.',
    })
    .max(20, {
      message: "Password can't be longer than 20 characters",
    }),
});
