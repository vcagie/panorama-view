import { saveAs } from 'file-saver';
import { useRouter } from 'next/router';
import styles from './HotspotManager.module.css';

const HotspotManager = ({ scenes, setScenes }) => {
    const router = useRouter();

    // Export hotspots to JSON
    const exportHotspots = () => {
        const blob = new Blob([JSON.stringify(scenes, null, 2)], { type: 'application/json' });
        saveAs(blob, 'hotspots.json');
    };

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

                    // Set the scenes and set the first scene as the current scene
                    setScenes(importedScenes);
                } catch (error) {
                    console.error(error);
                    alert('Error importing hotspots. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={() => router.push('/')}>Back to Dashboard</button>
            <h2 className={styles.title}>Import/Export Hotspots</h2>
            <button className={styles.exportButton} onClick={exportHotspots}>Export Hotspots</button>
            <input className={styles.fileInput} type="file" accept="application/json" onChange={importHotspots} />
        </div>
    );
};

export default HotspotManager;
