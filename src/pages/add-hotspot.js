"use client";
import PannellumViewer from "@/app/components/PannellumViewer";
import { useRouter } from "next/router";
import 'pannellum/build/pannellum.css';
import { useEffect } from "react";
import styles from './add-hotspot.module.css'; // Import the CSS file

const AddHotspotPage = () => {
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            require('pannellum/build/pannellum.js');
        }
    }, []);
    return (
        <div className={styles.addHotspotContainer}>
            <button className={styles.backButton} onClick={() => router.push('/')}>Back to Dashboard</button>
            <h1 className={styles.addHotspotTitle}>Add New Hotspot</h1>
            <div className={styles.viewerContainer}>
                <PannellumViewer />
            </div>
        </div>
    );
};

export default AddHotspotPage;