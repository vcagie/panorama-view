"use client";
import { useCallback, useEffect, useState } from 'react';
import styles from './ViewHotspots.module.css';

const ViewHotspots = ({ scenes, setScenes, handleTitleChange }) => {
    const [titleList, setTitleList] = useState({});

    useEffect(() => {
        const allTitle = {}
        if (Object.keys(scenes).length > 0) {
            Object.keys(scenes).map((sceneId) => {
                allTitle[sceneId] = scenes[sceneId].title;
            })
        }
        setTitleList(allTitle)
    }, [scenes])

    // Function to delete a specific hotspot
    const deleteHotspot = (sceneId, hotspotIndex) => {
        const updatedScenes = { ...scenes };
        updatedScenes[sceneId].hotSpots.splice(hotspotIndex, 1); // Remove the hotspot at the given index
        setScenes(updatedScenes); // Update the scenes state
    };

    // Function to delete an entire scene
    const deleteScene = (sceneId) => {
        const updatedScenes = { ...scenes };
        delete updatedScenes[sceneId]; // Remove the scene
        setScenes(updatedScenes); // Update the scenes state
    };

    const handleChangeTitle = useCallback((e, sceneId) => {
        titleList[sceneId] = e.target.value;
        setTitleList({ ...titleList });
        handleTitleChange(e.target.value, sceneId)
    }, []);

    return (
        <div className={styles.hotspotContainer}>
            {Object.keys(scenes).map((sceneId, sceneIndex) => (
                <div key={sceneIndex} className={styles.sceneSection}>
                    {/* Display the scene title with a delete button */}
                    <div className={styles.sceneHeader}>
                        <input
                            type="text"

                            value={titleList[sceneId]}
                            onChange={(e) => handleChangeTitle(e, sceneId)}
                            className={`${styles.inputDefault} ${styles.inputEdit}`}
                        />
                        <button className={styles.deleteBtn} onClick={() => deleteScene(sceneId)}>
                            Remove Scene
                        </button>
                    </div>

                    {/* List the hotspots for this scene */}
                    <ul className={styles.hotspotList}>
                        {scenes[sceneId]?.hotSpots.length > 0 ? (
                            scenes[sceneId].hotSpots.map((hotspot, hotspotIndex) => (
                                <li key={hotspotIndex} className={styles.hotspotItem}>
                                    <span>
                                        {/* <strong>Hotspot {hotspotIndex + 1}:</strong> Pitch: {hotspot.pitch}, Yaw: {hotspot.yaw}, Target Scene: {hotspot.sceneId} */}
                                        <strong>{hotspotIndex + 1}.</strong> Link to: <strong>{hotspot.title}</strong>
                                    </span>
                                    <button className={styles.deleteBtn} onClick={() => deleteHotspot(sceneId, hotspotIndex)}>
                                        Remove Link
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p className={styles.noHotspot}>No link available for this scene.</p>
                        )}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default ViewHotspots;
