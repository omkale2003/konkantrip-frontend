export default function Loader({ message = "Extracting data payload..." }) {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-12 space-y-4 animate-fadeIn">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-[var(--color-konkan-700)] rounded-full animate-spin"></div>
            <p className="text-slate-500 text-[13px] font-bold uppercase tracking-widest animate-pulse">{message}</p>
        </div>
    );
}
