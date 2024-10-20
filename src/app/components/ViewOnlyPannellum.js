"use client"; // Marks the component as a Client Component
import { useEffect, useRef, useState } from 'react';
import ButtonScene from './ButtonScene';
import FileUpload from './FileUpload';
import styles from './ViewOnlyPannellum.module.css';

// const ViewOnlyPannellum = ({ scenes, currentScene, setCurrentScene }) => {
const ViewOnlyPannellum = ({ currentScene, setCurrentScene }) => {
    const viewerRef = useRef(null); // Reference for the pannellum viewer
    const [scenes, setScenes] = useState({});

    // Function to handle JSON file import
    const importHotspots = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedScenes = JSON.parse(e.target.result);

                    // Check if scenes are valid, for safety
                    Object.keys(importedScenes).forEach(sceneId => {
                        const scene = importedScenes[sceneId];
                        if (!scene.panorama.startsWith('data:image/')) {
                            throw new Error(`Invalid panorama format for scene ${sceneId}`);
                        }
                    });

                    // Convert the object to an array of entries
                    const sortedEntries = Object.entries(importedScenes).sort(([, a], [, b]) => a.title.localeCompare(b.title));

                    // Convert the sorted entries back into an object
                    const sortedData = Object.fromEntries(sortedEntries);

                    // Set the scenes and set the first scene as the current scene
                    setScenes(sortedData);
                    setCurrentScene(Object.keys(sortedData)[0] || null); // Set the first scene as the current scene
                } catch (error) {
                    console.error(error);
                    alert('Error importing hotspots. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    };

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
            <FileUpload
                placeholder={"Import file"}
                className={styles.fileInput}
                onChange={importHotspots}
            />

            {Object.keys(scenes).length > 0 && (
                <div className={styles.viewContainer}>
                    <ButtonScene scenes={scenes} setCurrentScene={setCurrentScene} />
                    <div id="pano" className={styles.panoViewer}></div>
                </div>
            )}
        </div>
    );
};

export default ViewOnlyPannellum;
