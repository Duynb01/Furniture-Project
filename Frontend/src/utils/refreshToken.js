export async function refreshToken(url, options = {}) {
  // Khi chạy Server Component (SSR), chỉ fetch trực tiếp, không chạy logic refresh token của trình duyệt
  if (typeof window === "undefined") {
    return await fetch(url, options);
  }

  const defaultOptions = {
    credentials: "include",
    ...options,
  };
  const response = await fetch(url, defaultOptions);
  if (response.status !== 401) {
    return response;
  }

  const skipRetryRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/refresh",
    "/auth/logout",
    "/vouchers//claim",
  ];
  if (skipRetryRoutes.some((r) => url.includes(r)) || url.endsWith("/claim")) {
    return response;
  }

  try {
    const refreshRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (refreshRes.ok) {
      // Refresh thành công, thử lại request ban đầu với token mới
      return await fetch(url, defaultOptions);
    }
  } catch (error) {
    // Lỗi mạng hoặc server không phản hồi
  }

  // Nếu refresh thất bại (người dùng chưa đăng nhập hoặc phiên đã hết hạn):
  // Trả về chính response 401 ban đầu để nơi gọi (component) tự xử lý và hiển thị thông báo lỗi phù hợp
  return response;
}
