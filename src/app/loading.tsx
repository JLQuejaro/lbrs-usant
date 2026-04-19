import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-usant-red/20 blur-2xl rounded-full animate-pulse"></div>
          <div className="relative bg-white p-6 rounded-3xl shadow-2xl border-2 border-gray-100">
            <Image 
              src="/logo.png" 
              alt="USANT Logo" 
              width={120} 
              height={120} 
              className="object-contain animate-pulse"
              priority
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-900">USANT LBRS</h2>
          <p className="text-sm text-gray-600 font-medium">Loading your library...</p>
          <div className="flex gap-1.5 mt-2">
            <div className="w-2 h-2 bg-usant-red rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-usant-red rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-usant-red rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
