export default function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
       <div className={`p-3 rounded-xl ${color}`}>
          {icon}
       </div>
       <div>
          <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">{label}</p>
       </div>
    </div>
  );
}
