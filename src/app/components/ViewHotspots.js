"use client";
import styles from './ViewHotspots.module.css'; // Import the CSS file

const ViewHotspots = ({ scenes, setScenes }) => {
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


    return (
        // <div>
        //     {Object.keys(scenes).map((sceneId, sceneIndex) => (
        //         <div key={sceneIndex} style={{ marginBottom: '20px' }}>
        //             {/* Display the scene title with a delete button */}
        //             <div>
        //                 <h3>
        //                     {scenes[sceneId]?.title} <button onClick={() => deleteScene(sceneId)}>Delete Scene</button>
        //                 </h3>
        //             </div>

        //             {/* List the hotspots for this scene */}
        //             <ul>
        //                 {scenes[sceneId]?.hotSpots.length > 0 ? (
        //                     scenes[sceneId].hotSpots.map((hotspot, hotspotIndex) => (
        //                         <li key={hotspotIndex}>
        //                             Hotspot {hotspotIndex + 1}: Pitch: {hotspot.pitch}, Yaw: {hotspot.yaw}, Target Scene: {hotspot.sceneId}
        //                             <button onClick={() => deleteHotspot(sceneId, hotspotIndex)}>Delete Hotspot</button>
        //                         </li>
        //                     ))
        //                 ) : (
        //                     <p>No hotspots available for this scene.</p>
        //                 )}
        //             </ul>
        //         </div>
        //     ))}
        // </div>

        <div className={styles.hotspotContainer}>
            {Object.keys(scenes).map((sceneId, sceneIndex) => (
                <div key={sceneIndex} className={styles.sceneSection}>
                    {/* Display the scene title with a delete button */}
                    <div className={styles.sceneHeader}>
                        <h3>{scenes[sceneId]?.title}</h3>
                        <button className={styles.deleteBtn} onClick={() => deleteScene(sceneId)}>
                            Delete Scene
                        </button>
                    </div>

                    {/* List the hotspots for this scene */}
                    <ul className={styles.hotspotList}>
                        {scenes[sceneId]?.hotSpots.length > 0 ? (
                            scenes[sceneId].hotSpots.map((hotspot, hotspotIndex) => (
                                <li key={hotspotIndex} className={styles.hotspotItem}>
                                    <span>
                                        <strong>Hotspot {hotspotIndex + 1}:</strong> Pitch: {hotspot.pitch}, Yaw: {hotspot.yaw}, Target Scene: {hotspot.sceneId}
                                    </span>
                                    <button className={styles.deleteBtn} onClick={() => deleteHotspot(sceneId, hotspotIndex)}>
                                        Delete Hotspot
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p className={styles.noHotspot}>No hotspots available for this scene.</p>
                        )}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default ViewHotspots;
