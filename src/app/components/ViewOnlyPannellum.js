"use client"; // Marks the component as a Client Component
import { useEffect, useRef } from 'react';
import styles from './ViewOnlyPannellum.module.css';

const ViewOnlyPannellum = ({ scenes, currentScene, setCurrentScene }) => {
    const viewerRef = useRef(null); // Reference for the pannellum viewer

    // Initialize the Pannellum viewer when a scene is selected
    useEffect(() => {
        // Cleanup function to remove old viewer instance and associated elements
        const cleanupViewer = () => {
            if (viewerRef.current) {
                viewerRef.current.destroy(); // Destroy the Pannellum viewer instance
            }
        };

        // Initialize or update the Pannellum viewer only after cleanup
        const initializeViewer = () => {
            if (currentScene && scenes[currentScene]) {
                viewerRef.current = pannellum.viewer('pano', {
                    scenes,
                    default: { firstScene: currentScene },
                    autoLoad: true,
                    // panorama: scenes[currentScene].panorama,
                    // hotSpots: scenes[currentScene].hotSpots || [], // Display hotspots but no editing allowed
                });
            }
        };

        // Cleanup old viewer before initializing new one
        cleanupViewer();
        initializeViewer();

        // Cleanup function to be called on component unmount or when dependencies change
        return () => {
            cleanupViewer();
        };
    }, [currentScene, scenes]);

    return (
        <div className={styles.pannellumContainer}>
            <h1 className={styles.title}>View-Only Panorama</h1>
            <div id="pano" className={styles.panoViewer}></div>

            {Object.keys(scenes).length > 0 && (
                <div className={styles.sceneNavigation}>
                    <h2>Select Scene:</h2>
                    <ul className={styles.sceneList}>
                        {Object.keys(scenes).map(sceneId => (
                            <li key={sceneId}>
                                <button className={`${styles.sceneButton} ${currentScene === sceneId ? styles.active : ""}`} onClick={() => setCurrentScene(sceneId)}>
                                    {scenes[sceneId].title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ViewOnlyPannellum;
