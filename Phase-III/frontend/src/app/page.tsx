'use client';

import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Landing Page Component
 * Modern dark hero section with features and CTA
 */
export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTryItOut = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  };

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-500"></div>
          <p className="mt-4 text-lg text-gray-400">Loading TaskFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">T</span>
              </div>
              <span className="text-2xl font-bold text-white">TaskFlow</span>
            </div>
            <button
              onClick={handleTryItOut}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              {user ? 'Go to Dashboard' : 'Sign In'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium border border-blue-500/20">
                ✨ AI-Powered Task Management
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Organize Your Life with
              <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Intelligent Simplicity
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              TaskFlow combines powerful task management with AI assistance to help you stay productive, organized, and focused on what matters most.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleTryItOut}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-semibold rounded-xl shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105 transition-all"
              >
                🚀 Try It Out
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-gray-800 text-white text-lg font-semibold rounded-xl border border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-all"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-950 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">✓</span>
                    </div>
                    <span className="text-white font-medium">Smart Task Management</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-800 rounded w-full"></div>
                    <div className="h-3 bg-gray-800 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-800 rounded w-3/5"></div>
                  </div>
                </div>
                <div className="bg-gray-950 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🤖</span>
                    </div>
                    <span className="text-white font-medium">AI Assistant</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-800 rounded w-full"></div>
                    <div className="h-3 bg-gray-800 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Stay Productive
            </h2>
            <p className="text-xl text-gray-400">
              Powerful features designed for modern productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-blue-500/50 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Task Management</h3>
              <p className="text-gray-400 leading-relaxed">
                Create, organize, and track your tasks with an intuitive interface. Mark tasks as complete and stay on top of your goals.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-indigo-500/50 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">AI Assistant</h3>
              <p className="text-gray-400 leading-relaxed">
                Chat with your intelligent AI assistant to manage tasks naturally. Just tell it what you need, and it handles the rest.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Stay Focused</h3>
              <p className="text-gray-400 leading-relaxed">
                Filter tasks by status, track your progress with visual stats, and maintain focus on what matters most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl p-12 border border-blue-500/20">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join TaskFlow today and experience the future of task management
            </p>
            <button
              onClick={handleTryItOut}
              className="px-10 py-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xl font-bold rounded-xl shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105 transition-all"
            >
              🚀 Try It Out Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">
            © 2026 TaskFlow. Built with ❤️ for productivity enthusiasts.
          </p>
        </div>
      </footer>
    </div>
  );
}