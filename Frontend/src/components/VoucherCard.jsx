'use client';
import Image from 'next/image';
import { formatExpiryDate } from '@/utils/formatData';
import { claimVoucher } from '@/lib/api/apiVoucher';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addMyVoucher } from '@/redux/store/slices/voucherSlice';

export default function VoucherCard({ voucher, initialClaimed = false }) {
  const dispatch = useDispatch();
  const [isClaimed, setIsClaimed] = useState(initialClaimed);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsClaimed(initialClaimed);
  }, [initialClaimed]);

  const onClickSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await claimVoucher(voucher.id);
      setIsClaimed(true);
      dispatch(addMyVoucher(voucher));
      toast.success('Lưu voucher thành công!');
    } catch (err) {
      toast.warning(err.message);
      if (err.message?.includes('đã lưu') || err.message?.includes('đã nhận')) {
        setIsClaimed(true);
        dispatch(addMyVoucher(voucher));
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-w-[50%] px-[7px] xl:min-w-[25%] ">
      <div className="voucher-content flex bg-[#fdf0d1] rounded-xl">
        <div className="p-[10px]">
          <Image
            src="/voucher/voucher_1_img.svg"
            width={117}
            height={106}
            className="rounded-lg bg-[#121211] p-[10px]"
            alt="Voucher 1"
          />
        </div>
        <div className="w-full p-[10px]">
          <div className="pb-3">
            <h4 className="font-bold text-sm">{voucher.name}</h4>
          </div>
          <div className="text-[10px]">
            <p>
              Mã: <span className="font-bold text-[11px] uppercase">{voucher.code}</span>
            </p>
            <div className="flex items-center justify-between ">
              <span>HSD: {formatExpiryDate(voucher.expiryDate)}</span>
              <button
                onClick={onClickSave}
                disabled={loading || isClaimed}
                className={` ${
                  isClaimed ? 'bg-[#929191] pointer-events-none' : 'bg-main'
                } px-2 py-1 text-white uppercase rounded-full`}
              >
                {loading ? (
                  <div className="flex items-center gap-1">
                    <Loader className="w-3 h-3 animate-spin" />
                    <span>Đang lưu...</span>
                  </div>
                ) : isClaimed ? (
                  'đã sao chép'
                ) : (
                  'sao chép mã'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
