import HotspotManager from '@/app/components/HotspotManager';
import ViewHotspots from '@/app/components/ViewHotspots';
import { useEffect, useState } from 'react';
import styles from './manage-hotspots.module.css';

const ManageHotspotsPage = () => {
    const [scenes, setScenes] = useState({});

    // Retrieve scenes from localStorage or API on mount
    useEffect(() => {
        const storedScenes = JSON.parse(localStorage.getItem('scenes')) || {};
        setScenes(storedScenes);
    }, []);

    // Save scenes to localStorage whenever they are updated
    useEffect(() => {
        localStorage.setItem('scenes', JSON.stringify(scenes));
    }, [scenes]);

    return (
        <div className={styles.manageHotspotsContainer}>
            <h1 className={styles.manageHotspotsTitle}>Manage Hotspots</h1>
            <HotspotManager scenes={scenes} setScenes={setScenes} />

            <h1 className={styles.existingHotspotsTitle}>View Existing Hotspots</h1>
            <ViewHotspots
                scenes={scenes}
                setScenes={setScenes} // Pass setScenes to allow hotspot removal
            />
        </div>
    );
};

export default ManageHotspotsPage;
