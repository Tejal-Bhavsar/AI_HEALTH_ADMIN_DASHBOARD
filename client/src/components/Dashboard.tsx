import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Building2, Users, ClipboardList, UserPlus } from 'lucide-react';

interface Company {
    id: number;
    name: string;
    plan_details: any;
    created_at: string;
}

interface Employee {
    id: number;
}

interface Claim {
    id: number;
    status: string;
}

const Dashboard: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [employeesCount, setEmployeesCount] = useState(0);
    const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
    const [usersCount, setUsersCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [companiesRes, employeesRes, claimsRes, usersRes] = await Promise.all([
                    client.get('/companies'),
                    client.get('/employees'),
                    client.get('/claims'),
                    client.get('/users')
                ]);

                setCompanies(companiesRes.data);
                setEmployeesCount(employeesRes.data.length);
                setPendingClaimsCount(claimsRes.data.filter((c: any) => c.status === 'pending').length);
                setUsersCount(usersRes.data.length);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Overview of your health administration system.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">Total Companies</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : companies.length}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-50 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : usersCount}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-50 p-3 rounded-lg">
                            <UserPlus className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">Total Employees</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : employeesCount}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-amber-50 p-3 rounded-lg">
                            <ClipboardList className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">Pending Claims</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : pendingClaimsCount}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Companies</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                                </tr>
                            ) : companies.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No companies found.</td>
                                </tr>
                            ) : (
                                companies.map((company) => (
                                    <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{JSON.stringify(company.plan_details)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(company.created_at).toLocaleDateString()}</td>
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

export default Dashboard;
