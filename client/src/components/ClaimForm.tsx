import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ClaimFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

interface Employee {
    id: number;
    name: string;
}

const ClaimForm: React.FC<ClaimFormProps> = ({ onSuccess, onCancel }) => {
    const navigate = useNavigate();
    const [employeeId, setEmployeeId] = useState<number | ''>('');
    const [amount, setAmount] = useState('');
    const [serviceDate, setServiceDate] = useState('');
    const [providerName, setProviderName] = useState('');
    const [diagnosisCode, setDiagnosisCode] = useState('');
    const [description, setDescription] = useState('');
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingEmployees, setFetchingEmployees] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            setFetchingEmployees(true);
            try {
                const response = await client.get('/employees');
                setEmployees(response.data);
            } catch (err) {
                console.error('Failed to fetch employees', err);
                setError('Failed to fetch employee list. Please check your connection.');
            } finally {
                setFetchingEmployees(false);
            }
        };
        fetchEmployees();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = {
            employee_id: Number(employeeId),
            amount: Number(amount),
            service_date: serviceDate,
            provider_name: providerName,
            diagnosis_code: diagnosisCode,
            description,
        };

        try {
            await client.post('/claims', payload);
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred during submission');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingEmployees) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500 font-medium">Loading employees...</p>
                </div>
            </div>
        );
    }

    if (employees.length === 0) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-8 relative text-center">
                    <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-full">
                        <AlertCircle className="w-8 h-8 text-amber-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No Employees Found</h2>
                    <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                        You need to add at least one employee before you can file a medical claim.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                onCancel();
                                navigate('/employees');
                            }}
                            className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            <UserPlus className="w-5 h-5 mr-2" />
                            Add Your First Employee
                        </button>
                        <button
                            onClick={onCancel}
                            className="w-full px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                        >
                            Back to Claims
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
                <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-6">File New Claim</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                            <select
                                required
                                value={employeeId}
                                onChange={(e) => setEmployeeId(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                            >
                                <option value="">Select Employee</option>
                                {employees.map(e => (
                                    <option key={e.id} value={e.id}>{e.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Service Date</label>
                            <input
                                type="date"
                                required
                                value={serviceDate}
                                onChange={(e) => setServiceDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Provider Name</label>
                            <input
                                type="text"
                                required
                                value={providerName}
                                onChange={(e) => setProviderName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Medical Clinic"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis Code</label>
                        <input
                            type="text"
                            value={diagnosisCode}
                            onChange={(e) => setDiagnosisCode(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="ICD-10 Code"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Brief description of the service..."
                        />
                    </div>

                    <div className="flex justify-end pt-4 space-x-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 shadow-sm shadow-indigo-200 transition-all font-semibold"
                        >
                            {loading ? 'Submitting...' : 'Submit Claim'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClaimForm;
