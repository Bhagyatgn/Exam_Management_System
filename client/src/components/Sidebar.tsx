import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FilePen, 
  GraduationCap, 
  PlusCircle, 
  ClipboardCheck,
  UserCheck,
  BookOpenCheck,
  Calendar
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  currentTab: string;
  setTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isLoggedIn: boolean;
}

export default function Sidebar({ role, currentTab, setTab, isOpen, setIsOpen, isLoggedIn }: SidebarProps) {
  const studentNavItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'modules', label: 'Enrolled Modules', icon: BookOpen },
    { id: 'exams', label: 'Available Exams', icon: FilePen },
    { id: 'results', label: 'My Results', icon: GraduationCap },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  const teacherNavItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'modules', label: 'Manage Modules', icon: BookOpenCheck },
    { id: 'create-exam', label: 'Create Exam', icon: PlusCircle },
    { id: 'submissions', label: 'Grading & Submissions', icon: ClipboardCheck },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  const navItems = role === 'student' ? studentNavItems : teacherNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-16 bottom-0 left-0 z-30 w-64 bg-white border-r border-slate-100 transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full justify-between p-4">
          <div className="space-y-6">
            {/* Role Indicator Badge */}
            <div className="px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${!isLoggedIn ? 'bg-slate-100 text-slate-500' : role === 'teacher' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                <UserCheck size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">{isLoggedIn ? 'LOGGED IN AS' : 'BROWSER MODE'}</p>
                <p className="text-sm font-semibold text-slate-800 capitalize">{isLoggedIn ? `${role} Portal` : 'Guest Portal'}</p>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="space-y-1.5" id="sidebar-nav">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => {
                      setTab(item.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? role === 'teacher' 
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700' 
                          : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                  >
                    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          

          {/* Footer */}
          <div className="text-xs text-slate-400 text-center">
            &copy; 2026 EduTest. All rights reserved.
          </div>
        </div>
      </aside>
    </>
  );
}
