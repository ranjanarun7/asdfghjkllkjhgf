import React, { useEffect, useState } from 'react';
import { Activity, AlertCircle,ArrowLeft } from 'lucide-react';
import * as StorageService from '../services/storageService';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const FeedbackDashboard = () => {
  const [feedback, setFeedback] = useState([]);
  const [recentFailures] = useState([]);
  const [showAll, setShowAll] = useState(false);


  useEffect(() => {
    const load = async () => {
      const data = await StorageService.getFeedback();
      setFeedback(Array.isArray(data) ? data : []);
    };
    load();
  }, []);

  const metrics = {
    total: feedback.length,
    pending: feedback.filter(f => f.status === 'pending').length,
    alerts: feedback.filter(f => f.analysis?.shouldRaiseAlert).length,
    critical: feedback.filter(f => f.analysis?.safetyFlags?.isUrgent).length,
  };

  const sentimentData = [
    { name: 'Positive', value: feedback.filter(f => f.analysis?.sentimentLabel === 'POSITIVE').length, color: '#22c55e' },
    { name: 'Negative', value: feedback.filter(f => f.analysis?.sentimentLabel === 'NEGATIVE').length, color: '#ef4444' },
    { name: 'Neutral', value: feedback.filter(f => f.analysis?.sentimentLabel === 'NEUTRAL').length, color: '#94a3b8' },
    { name: 'Mixed', value: feedback.filter(f => f.analysis?.sentimentLabel === 'MIXED').length, color: '#eab308' },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 bg-gray-100 min-h-screen">
 <a href="/admin">
  <button className="btn flex items-center gap-2">
    <ArrowLeft size={18} />
    <span>Back</span>
  </button>
</a>
      {/* AI STATUS */}
      <div className="bg-gray-900 text-white p-6 rounded-xl flex justify-between">
        <button
  onClick={() => setShowAll(prev => !prev)}
  className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
>
  {showAll ? "Hide Feedback" : "View All Feedback"}
</button>

        <div className="flex items-center gap-2">
          <Activity className="text-blue-400" />
          AI Status
        </div>
        <span className="bg-gray-600 px-3 py-1 rounded">Idle</span>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Total Feedback" value={metrics.total} />
        <Stat title="Pending" value={metrics.pending} />
        <Stat title="Alerts" value={metrics.alerts} />
        <Stat title="Critical" value={metrics.critical} />
      </div>

      {/* CHART + FAILURES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold mb-3">Sentiment Overview</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={sentimentData} dataKey="value" outerRadius={90}>
                {sentimentData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold mb-3">System Warnings</h3>
          {recentFailures.length === 0 ? (
            <p className="text-gray-500 italic">No failures detected</p>
          ) : (
            recentFailures.map((item, i) => (
              <p key={i} className="flex text-red-500">
                <AlertCircle className="mr-2" size={14} />
                {item.targetName}
              </p>
            ))
          )}
        </div>

      </div>
      {showAll && (
  <div className="bg-white rounded-xl p-6">
    <h3 className="text-xl font-bold mb-4">All User Feedback</h3>

    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">User</th>
            <th className="p-2 border">Itinerary</th>
            <th className="p-2 border">Rating</th>
            <th className="p-2 border">Comment</th>
            <th className="p-2 border">Sentiment</th>
            <th className="p-2 border">Alert</th>
          </tr>
        </thead>

        <tbody>
          {feedback.map((f) => (
            <tr key={f._id} className="border-t">
              <td className="p-2 border">{f.userName || "Guest User"}</td>
              <td className="p-2 border">{f.targetName}</td>
              <td className="p-2 border">{f.rating || "N/A"}</td>
              <td className="p-2 border">{f.comment}</td>
              <td className="p-2 border">
                {f.analysis?.sentimentLabel || "Pending"}
              </td>
              <td className="p-2 border">
                {f.analysis?.shouldRaiseAlert ? "🚨 Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  </div>
)}

    </div>
  );
};

const Stat = ({ title, value }) => (
  <div className="bg-white rounded-xl p-4 text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);

export default FeedbackDashboard;
