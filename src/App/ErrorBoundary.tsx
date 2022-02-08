import React from 'react';

export default class ErrorBoundary extends React.Component<any> {
  state: { hasError: boolean; error: Error | null } = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  handleReload = () => {
    location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', margin: 20 }}>
          <h1 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Something went wrong.</h1>
          <p style={{ color: '#00417a' }}>{this.state.error.message}</p>
          <p style={{ color: '#00417a' }}>{this.state.error.stack}</p>
          <button onClick={this.handleReload}>Reload Page</button>
        </div>
      );
    }

    return this.props.children; 
  }
}
