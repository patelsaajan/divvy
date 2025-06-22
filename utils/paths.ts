export const paths = {
  home: "/",
  settings: "/settings",
  upload: "/upload",
  receipt: (id: string) => `/receipt/${id}`,
  auth: {
    error: "/auth/error",
    confirm: "/auth/confirm",
    signin: "/auth/signin",
    signup: "/auth/signup",
  },
} as const;
