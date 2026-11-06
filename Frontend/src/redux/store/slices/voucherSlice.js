import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allVouchers: [], // Danh sách tất cả voucher của cửa hàng
  myVouchers: [],  // Danh sách voucher mà người dùng hiện tại đã lưu
};

const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {
    // Nạp toàn bộ voucher của cửa hàng
    setVouchers: (state, action) => {
      state.allVouchers = action.payload || [];
    },
    // Nạp toàn bộ voucher cá nhân của người dùng
    setMyVouchers: (state, action) => {
      state.myVouchers = action.payload || [];
    },
    // Thêm 1 voucher mới vào danh sách cá nhân khi bấm Lưu thành công
    addMyVoucher: (state, action) => {
      const exists = state.myVouchers.some((v) => v.id === action.payload.id);
      if (!exists) {
        state.myVouchers.push(action.payload);
      }
    },
    // Xóa danh sách cá nhân khi người dùng Đăng xuất (Logout)
    clearMyVouchers: (state) => {
      state.myVouchers = [];
    },
  },
});

export const { setVouchers, setMyVouchers, addMyVoucher, clearMyVouchers } =
  voucherSlice.actions;

export default voucherSlice.reducer;
