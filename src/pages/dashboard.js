"use client";
import Button from '@/app/components/Button';
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
            <h1 className={styles.title}>Virtual Tour</h1>
            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    <li className={styles.navItem}>
                        <Link href="/add-hotspot">
                            <Button>
                                Add New Tour
                            </Button>
                        </Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/view-hotspots">
                            <Button>
                                View Tour
                            </Button>
                        </Link>
                    </li>
                    {/* <li className={styles.navItem}><Link href="/manage-hotspots">Manage Hotspots</Link></li> */}
                </ul>
            </nav>
        </div>
    );
};

export default Dashboard;
