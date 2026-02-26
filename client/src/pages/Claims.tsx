import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { ClipboardList, Search, Filter, CheckCircle, XCircle, AlertCircle, Clock, Info } from 'lucide-react';
import ClaimForm from '../components/ClaimForm';

interface Claim {
    id: number;
    employee_id: number;
    employee_name: string;
    amount: number;
    service_date: string;
    provider_name: string;
    diagnosis_code: string;
    description: string;
    status: 'pending' | 'approved' | 'rejected' | 'flagged';
    ai_analysis: any;
    created_at: string;
}

const Claims: React.FC = () => {
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

    const fetchClaims = async () => {
        setLoading(true);
        try {
            const response = await client.get('/claims');
            setClaims(response.data);
        } catch (error) {
            console.error('Failed to fetch claims:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClaims();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'flagged': return <AlertCircle className="w-4 h-4 text-amber-500" />;
            default: return <Clock className="w-4 h-4 text-blue-500" />;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-50 text-green-700 border-green-100';
            case 'rejected': return 'bg-red-50 text-red-700 border-red-100';
            case 'flagged': return 'bg-amber-50 text-amber-700 border-amber-100';
            default: return 'bg-blue-50 text-blue-700 border-blue-100';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Claims</h1>
                    <p className="mt-1 text-sm text-gray-500">Review and manage medical insurance claims.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <ClipboardList className="w-4 h-4 mr-2" />
                    New Claim
                </button>
            </div>

            {showForm && (
                <ClaimForm
                    onSuccess={() => {
                        setShowForm(false);
                        fetchClaims();
                    }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {selectedClaim && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
                        <h2 className="text-xl font-bold mb-4">AI Analysis Detail</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Risk Score</span>
                                <span className={`text-lg font-bold ${selectedClaim.ai_analysis.risk_score > 40 ? 'text-amber-600' : 'text-green-600'}`}>
                                    {selectedClaim.ai_analysis.risk_score}/100
                                </span>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-1">AI Summary</h3>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                                    "{selectedClaim.ai_analysis.summary}"
                                </p>
                            </div>
                            {selectedClaim.ai_analysis.flags.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Flags Detected</h3>
                                    <div className="space-y-2">
                                        {selectedClaim.ai_analysis.flags.map((flag: string, idx: number) => (
                                            <div key={idx} className="flex items-center text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-md border border-amber-100">
                                                <AlertCircle className="w-3.5 h-3.5 mr-2" />
                                                {flag}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setSelectedClaim(null)}
                            className="w-full mt-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search claims..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Analysis</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                                </tr>
                            ) : claims.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No claims found.</td>
                                </tr>
                            ) : (
                                claims.map((claim) => (
                                    <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{claim.employee_name}</div>
                                            <div className="text-xs text-gray-500">{claim.provider_name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(claim.service_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            ${Number(claim.amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(claim.status)}`}>
                                                <span className="mr-1.5">{getStatusIcon(claim.status)}</span>
                                                {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {claim.ai_analysis ? (
                                                <button
                                                    onClick={() => setSelectedClaim(claim)}
                                                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-2 py-1 rounded"
                                                >
                                                    <Info className="w-3.5 h-3.5 mr-1.5" />
                                                    View AI Analysis
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 italic">Not analyzed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Claims;
