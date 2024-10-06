"use client";
import Link from 'next/link';
import 'pannellum/build/pannellum.css';
import { useEffect } from 'react';
import styles from './dashboard.module.css';

const Dashboard = () => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            require('pannellum/build/pannellum.js');
        }
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Virtual Tour Dashboard</h1>
            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    <li className={styles.navItem}><Link href="/add-hotspot">Add New Hotspot</Link></li>
                    <li className={styles.navItem}><Link href="/view-hotspots">View Existing Hotspots</Link></li>
                    {/* <li className={styles.navItem}><Link href="/manage-hotspots">Manage Hotspots</Link></li> */}
                </ul>
            </nav>
        </div>
    );
};

export default Dashboard;
