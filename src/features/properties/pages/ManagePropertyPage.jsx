import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function ManagePropertyPage() {
  const { propertyId } = useParams();

  return (
    <div className="space-y-6">

      {/* Back */}
      <Link
        to="/owner/properties"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Properties
      </Link>

      {/* Header */}
      <section>
        <p className="mb-1 text-sm font-medium text-emerald-700">
          Property Management
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Manage Property
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your property information and complete the setup.
        </p>
      </section>

      {/* Temporary property information */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Property ID
        </p>

        <p className="mt-1 text-lg font-semibold text-slate-900">
          {propertyId}
        </p>
      </section>

    </div>
  );
}

export default ManagePropertyPage;