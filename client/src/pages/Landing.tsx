import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Building2, UserPlus, ClipboardList, ArrowRight, ShieldCheck, Zap, Activity } from 'lucide-react';

const Landing: React.FC = () => {
    return (
        <div className="space-y-12 py-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                    Welcome to <span className="text-indigo-600">HealthAdmin</span>
                </h1>
                <p className="text-xl text-gray-500 leading-relaxed">
                    The next-generation AI-powered platform for health administration, insurance claims, and employee coverage management.
                </p>
                <div className="pt-6">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
                    >
                        Go to Dashboard
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* Features/Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                <QuickActionCard
                    title="Companies"
                    description="Manage client organizations and their insurance plans."
                    icon={<Building2 className="w-6 h-6 text-blue-600" />}
                    link="/companies"
                    color="blue"
                />
                <QuickActionCard
                    title="Employees"
                    description="Onboard and manage employee coverage details."
                    icon={<UserPlus className="w-6 h-6 text-purple-600" />}
                    link="/employees"
                    color="purple"
                />
                <QuickActionCard
                    title="Claims"
                    description="File and track medical insurance claims."
                    icon={<ClipboardList className="w-6 h-6 text-amber-600" />}
                    link="/claims"
                    color="amber"
                />
                <QuickActionCard
                    title="Metrics"
                    description="View real-time system performance and AI insights."
                    icon={<Activity className="w-6 h-6 text-indigo-600" />}
                    link="/dashboard"
                    color="indigo"
                />
            </div>

            {/* Value Props */}
            <div className="bg-indigo-600 rounded-2xl p-8 md:p-12 text-white overflow-hidden relative">
                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">Why AI-Driven HealthAdmin?</h2>
                        <div className="space-y-4">
                            <Feature
                                icon={<Zap className="w-5 h-5" />}
                                text="Automated claim analysis and risk scoring."
                            />
                            <Feature
                                icon={<ShieldCheck className="w-5 h-5" />}
                                text="Fraud detection and policy compliance checks."
                            />
                            <Feature
                                icon={<LayoutDashboard className="w-5 h-5" />}
                                text="Seamless integration with provider networks."
                            />
                        </div>
                    </div>
                </div>
                {/* Subtle background decoration */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 opacity-10">
                    <ShieldCheck className="w-96 h-96" />
                </div>
            </div>
        </div>
    );
};

const QuickActionCard = ({ title, description, icon, link, color }: any) => {
    const colorClasses: any = {
        blue: 'hover:border-blue-200 hover:bg-blue-50/30',
        purple: 'hover:border-purple-200 hover:bg-purple-50/30',
        amber: 'hover:border-amber-200 hover:bg-amber-50/30',
        indigo: 'hover:border-indigo-200 hover:bg-indigo-50/30',
    };

    return (
        <Link
            to={link}
            className={`p-6 bg-white border border-gray-100 rounded-2xl shadow-sm transition-all duration-300 ${colorClasses[color]}`}
        >
            <div className={`mb-4 p-3 rounded-xl inline-block bg-${color}-50`}>
                {icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">{description}</p>
            <div className={`text-sm font-semibold text-${color}-600 flex items-center`}>
                Manage {title} <ArrowRight className="ml-1 w-4 h-4" />
            </div>
        </Link>
    );
};

const Feature = ({ icon, text }: any) => (
    <div className="flex items-center space-x-3">
        <div className="p-1 bgColor-white/20 rounded-md">
            {icon}
        </div>
        <span className="text-lg opacity-90">{text}</span>
    </div>
);

export default Landing;
