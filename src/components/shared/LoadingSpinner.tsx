export default function LoadingSpinner({ text = 'Đang tải...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-10 h-10 border-4 border-[#1B5E20] border-t-transparent rounded-full animate-spin" />
      <p className="text-[#6B7280] text-sm">{text}</p>
    </div>
  );
}
