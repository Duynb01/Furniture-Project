import { refreshToken } from "./refreshToken";

const getUrl = (url) => {
  // Chỉ chuyển sang INTERNAL_API_URL khi chạy SSR bên trong container Docker (Linux)
  if (
    typeof window === "undefined" &&
    process.platform !== "win32" &&
    process.env.INTERNAL_API_URL
  ) {
    const internalUrl = process.env.INTERNAL_API_URL;
    const publicUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    return url.replace(publicUrl, internalUrl);
  }
  return url;
};

export const api = {
  get: (url) => refreshToken(getUrl(url)),
  post: (url, data) =>
    refreshToken(getUrl(url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  patch: (url, data) =>
    refreshToken(getUrl(url), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  delete: (url, data = "") =>
    refreshToken(getUrl(url), {
      method: "DELETE",
      body: JSON.stringify(data),
    }),
};
