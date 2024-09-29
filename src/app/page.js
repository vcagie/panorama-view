import Dashboard from '@/pages/dashboard';
import Head from 'next/head';

export default function Home() {
  return (
    // <div style={{ width: 1000, textAlign: 'center' }}>
    //   <Head>
    //     <title>Pannellum Tour</title>
    //     <meta name="description" content="A dynamic tour with Pannellum in Next.js" />
    //   </Head>
    //   <Dashboard />
    //   {/* <PannellumViewer /> */}
    // </div>
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f0f0', padding: '20px' }}>
      <Head>
        <title>Pannellum Tour</title>
        <meta name="description" content="A dynamic tour with Pannellum in Next.js" />
      </Head>
      <Dashboard />
    </div>
  );
}