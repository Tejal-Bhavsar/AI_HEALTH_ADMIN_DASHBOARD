import React from 'react';
import { LayoutDashboard, Users, Building2, FileText, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const linkClass = (path: string) =>
        `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive(path)
            ? 'text-gray-700 bg-gray-100 font-medium'
            : 'text-gray-600 hover:bg-gray-50'
        }`;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <span className="text-xl font-bold text-indigo-600">HealthAdmin</span>
                </div>
                <nav className="p-4 space-y-1">
                    <Link to="/" className={linkClass('/')}>
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Dashboard
                    </Link>
                    <Link to="/companies" className={linkClass('/companies')}>
                        <Building2 className="w-5 h-5 mr-3" />
                        Companies
                    </Link>
                    <Link to="/users" className={linkClass('/users')}>
                        <Users className="w-5 h-5 mr-3" />
                        Users
                    </Link>
                    <Link to="/claims" className={linkClass('/claims')}>
                        <FileText className="w-5 h-5 mr-3" />
                        Claims
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-8">
                    <button className="md:hidden p-2 -ml-2 text-gray-600">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                            AD
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
