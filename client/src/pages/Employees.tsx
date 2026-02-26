import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { UserPlus, Search, Filter, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import EmployeeForm from '../components/EmployeeForm';

interface Employee {
    id: number;
    name: string;
    email: string;
    company_id: number;
    coverage_details: any;
    created_at: string;
}

const Employees: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>();

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await client.get('/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage company employees and their coverage details.</p>
                </div>
                <button
                    onClick={() => {
                        setSelectedEmployee(undefined);
                        setShowForm(true);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Employee
                </button>
            </div>

            {showForm && (
                <EmployeeForm
                    employee={selectedEmployee}
                    onSuccess={() => {
                        setShowForm(false);
                        fetchEmployees();
                    }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coverage</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                                <th className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                                </tr>
                            ) : employees.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No employees found.</td>
                                </tr>
                            ) : (
                                employees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{employee.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                                                {typeof employee.coverage_details === 'string' ? employee.coverage_details : 'Standard'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(employee.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    setSelectedEmployee(employee);
                                                    setShowForm(true);
                                                }}
                                                className="text-gray-400 hover:text-indigo-600 mr-3 p-1 rounded-full hover:bg-indigo-50 transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
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

export default Employees;
