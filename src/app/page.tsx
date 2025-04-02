'use client';

export default function Home() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: 'red', fontSize: '32px' }}>TEST PAGE</h1>
      <p style={{ fontSize: '24px' }}>Time: {new Date().toLocaleString()}</p>
    </div>
  )
}
