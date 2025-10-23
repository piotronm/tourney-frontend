import { useLocation, useParams } from 'react-router-dom';

export function RouterDiagnostic({ label }: { label: string }) {
  try {
    const location = useLocation();
    const params = useParams();

    console.log(`✅ ${label} - Router Context Available:`, {
      pathname: location.pathname,
      params
    });

    return (
      <div style={{
        padding: '8px',
        margin: '8px',
        border: '2px solid green',
        background: '#e8f5e9'
      }}>
        ✅ {label}: Router Context OK
        <br />
        Path: {location.pathname}
      </div>
    );
  } catch (error) {
    console.error(`❌ ${label} - Router Context Missing:`, error);

    return (
      <div style={{
        padding: '8px',
        margin: '8px',
        border: '2px solid red',
        background: '#ffebee'
      }}>
        ❌ {label}: Router Context MISSING
        <br />
        Error: {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }
}
