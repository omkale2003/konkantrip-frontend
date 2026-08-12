import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-bold text-slate-900">KonkanTrip</h1>
        <p className="mb-8 text-lg text-slate-600">Property Owner Portal</p>
        
        <div className="flex items-center justify-center gap-4">
          <Link 
            to={ROUTES.LOGIN}
            className="rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 shadow-sm"
          >
            Login to Portal
          </Link>
          <Link 
            to={ROUTES.REGISTER}
            className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 shadow-sm"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}

export default App;