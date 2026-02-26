import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { X } from 'lucide-react';

interface EmployeeFormProps {
    employee?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

interface Company {
    id: number;
    name: string;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSuccess, onCancel }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [companyId, setCompanyId] = useState<number | ''>('');
    const [coverage, setCoverage] = useState('Standard');
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await client.get('/companies');
                setCompanies(response.data);
            } catch (err) {
                console.error('Failed to fetch companies', err);
            }
        };
        fetchCompanies();
    }, []);

    useEffect(() => {
        if (employee) {
            setName(employee.name);
            setEmail(employee.email);
            setCompanyId(employee.company_id || '');
            setCoverage(employee.coverage_details || 'Standard');
        }
    }, [employee]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = {
            name,
            email,
            company_id: companyId ? Number(companyId) : null,
            coverage_details: coverage,
        };

        try {
            if (employee) {
                await client.put(`/employees/${employee.id}`, payload);
            } else {
                await client.post('/employees', payload);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
                <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {employee ? 'Edit Employee' : 'Add New Employee'}
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <select
                            required
                            value={companyId}
                            onChange={(e) => setCompanyId(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select Company</option>
                            {companies.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Plan</label>
                        <select
                            value={coverage}
                            onChange={(e) => setCoverage(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="Basic">Basic</option>
                            <option value="Standard">Standard</option>
                            <option value="Premium">Premium</option>
                        </select>
                    </div>

                    <div className="flex justify-end pt-4 space-x-3">
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
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeForm;
