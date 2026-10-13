import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Standard React Error Boundary catching unhandled runtime exceptions in UI.
 * Matches Week 9-10 syllabus: Error Boundaries.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary captured exception:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-600 mb-6">
              A temporary glitch occurred while rendering the page. You can reload to restore normal navigation.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-campus-600 text-white font-medium hover:bg-campus-700 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
