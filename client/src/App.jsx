import { useState } from "react";

const API_URL = "http://localhost:3001";

export default function App() {
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState([]);
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [improving, setImproving] = useState(false);

  const generateReport = async () => {
    if (!notes.trim()) return;
    setLoading(true);
    setReport("");

    const formData = new FormData();
    formData.append("notes", notes);
    images.forEach(img => formData.append("images", img));

    const res = await fetch(`${API_URL}/generate-report`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setReport(data.report);
    setLoading(false);
  };

  const improveReport = async () => {
    setImproving(true);
    const res = await fetch(`${API_URL}/improve-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ report }),
    });
    const data = await res.json();
    setReport(data.report);
    setImproving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Field Report Generator</h1>
          <p className="text-gray-500 mt-1">Turn rough site notes into professional reports</p>
        </div>

        {/* Input */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What happened on site today?
          </label>
          <textarea
            className="w-full border border-gray-200 rounded-lg p-3 text-sm h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Laid foundation on block C. Had one near-miss with forklift at 10am. Weather was bad, delayed concrete pour. Two workers missing PPE, reminded on site."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />

          {/* Image upload */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site images (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={e => setImages(Array.from(e.target.files))}
              className="text-sm text-gray-500"
            />
            {images.length > 0 && (
              <p className="text-xs text-green-600 mt-1">{images.length} image(s) selected</p>
            )}
          </div>

          <button
            onClick={generateReport}
            disabled={loading || !notes.trim()}
            className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>

        {/* Output */}
        {report && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800">Daily Site Report</h2>
              <button
                onClick={improveReport}
                disabled={improving}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
              >
                {improving ? "Improving..." : "✨ Make more professional"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans">
              {report}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}