import Dashboard from '@/pages/dashboard';
import Head from 'next/head';

export default function Home() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: "center", backgroundColor: '#f0f0f0', padding: '20px' }}>
      <Head>
        <title>3D View Tour</title>
        <meta name="description" content="3d panoramic view tour" />
      </Head>
      <Dashboard />
    </div>
  );
}