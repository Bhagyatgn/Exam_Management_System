import React from 'react';
import { Bell, Search, GraduationCap, Menu, X, ArrowLeftRight } from 'lucide-react';
import { User, UserRole } from '../types';

interface HeaderProps {
  currentUser: User | null;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

export default function Header({ currentUser, role, onRoleChange, sidebarOpen, setSidebarOpen, onLogout }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-slate-100 flex items-center justify-between px-3 lg:px-6 z-40">
      {/* Brand Logo & Mobile Toggle */}
      <div className="flex items-center space-x-5">
        <button 
          id="mobile-sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-50 lg:hidden focus:outline-none"
        > 
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-indigo-700 rounded-xl text-white shadow-md shadow-indigo-600/20">
            <GraduationCap size={30} className="stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            EduTest <span className="text-indigo-600 font-medium text-xs bg-indigo-50 px-2 py-0.5 rounded-full ml-1 border border-indigo-100">Portal</span>
          </span>
        </div>
      </div>

      {/* Global Action Area */}
      <div className="flex items-center space-x-3 lg:space-x-6">
        {/* Aesthetic Search (hidden on small screens) */}
        <div className="relative hidden md:block max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search exams, courses..." 
            className="w-56 lg:w-64 bg-slate-50 border border-slate-200/80 rounded-full pl-10 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-150"
          />
        </div>

        {/* Role Toggle Switch (Super intuitive and beautifully styled) */}
        {currentUser && currentUser.role === 'teacher' && (
          <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200/60 shadow-inner">
            <button
              id="role-switch-student"
              onClick={() => onRoleChange('student')}
              className={`
                px-3.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 flex items-center space-x-1.5
                ${role === 'student' 
                  ? 'bg-white text-emerald-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
                }
              `}
            >
              <span>Student View</span>
            </button>
            <button
              id="role-switch-teacher"
              onClick={() => onRoleChange('teacher')}
              className={`
                px-3.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 flex items-center space-x-1.5
                ${role === 'teacher' 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
                }
              `}
            >
              <span>Teacher View</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 lg:space-x-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-full text-slate-500 hover:bg-slate-50 transition-colors">
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            <Bell size={18} />
          </button>

          {/* Divider */}
          <div className="h-5 w-px bg-slate-200" />

          {/* User Profile or Login Actions */}
          {currentUser ? (
            <div className="flex items-center space-x-2.5 pl-1.5">
              <img 
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'} 
                alt={currentUser.name} 
                referrerPolicy="no-referrer"
                className={`w-8.5 h-8.5 rounded-full object-cover ring-2 ${role === 'teacher' ? 'ring-indigo-100' : 'ring-emerald-100'}`}
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none mb-0">{currentUser.name}</p>
                <p className="text-2xs text-slate-400 mt-1 font-medium leading-none">{currentUser.email}</p>
              </div>
              <button 
                onClick={onLogout}
                className="ml-2 px-2.5 py-1 text-2xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-100 transition-all duration-150 focus:outline-none"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 pl-1.5">
              <a 
                href="/login" 
                className="px-3 py-1.5 text-xs font-bold text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                Log In
              </a>
              <a 
                href="/register" 
                className="px-3 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Register
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
