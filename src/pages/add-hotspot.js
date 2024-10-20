"use client";
import Button from "@/app/components/Button";
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
            <Button iconPosition='left' onClick={() => router.push('/')}>
                Back
            </Button>
            <h1 className={styles.addHotspotTitle}>ADD NEW TOUR</h1>
            <PannellumViewer />
        </div>
    );
};

export default AddHotspotPage;