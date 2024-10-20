"use client";
import Button from '@/app/components/Button';
import ViewOnlyPannellum from '@/app/components/ViewOnlyPannellum';
import { useRouter } from 'next/router';
import 'pannellum/build/pannellum.css';
import { useEffect, useState } from 'react';
import styles from './view-hotspots.module.css';

const ViewHotspotsPage = () => {
    const [scenes, setScenes] = useState({});
    const [currentScene, setCurrentScene] = useState(null);
    const router = useRouter();

    // Retrieve scenes from localStorage or API on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            require('pannellum/build/pannellum.js');
        }

        const storedScenes = JSON.parse(localStorage.getItem('scenes')) || {};
        setScenes(storedScenes);
        setCurrentScene(Object.keys(storedScenes)[0] || null); // Set the first scene as the current scene
    }, []);

    return (
        <div className={styles.viewHotspotsContainer}>
            <Button iconPosition='left' onClick={() => router.push('/')}>
                Back
            </Button>
            <h1 className={styles.viewTitle}>VIEW TOUR</h1>
            <ViewOnlyPannellum
                scenes={scenes}
                setCurrentScene={setCurrentScene}
                currentScene={currentScene}
            />
        </div>
    );
};

export default ViewHotspotsPage;
