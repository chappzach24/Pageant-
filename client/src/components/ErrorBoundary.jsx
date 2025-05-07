// Create a new file called ErrorBoundary.jsx in your components folder

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary p-4 border border-danger rounded">
          <h3 className="text-danger">Something went wrong</h3>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Show error details</summary>
            <p>{this.state.error && this.state.error.toString()}</p>
            <p>Component Stack Error Details:</p>
            <pre className="bg-light p-3">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          {this.props.fallback}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;