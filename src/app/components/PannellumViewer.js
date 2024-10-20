"use client"; // Marks the component as a Client Component
import { saveAs } from 'file-saver';
import { useEffect, useRef, useState } from 'react';
import Button from './Button';
import ButtonScene from './ButtonScene';
import FileUpload from './FileUpload';
import styles from './PannelumViewer.module.css';
import ViewHotspots from './ViewHotspots';

const Marker = ({ position }) => (
    <div
        style={{
            position: 'absolute',
            top: position.top,
            left: position.left,
            width: '20px',
            height: '20px',
            backgroundColor: 'red',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
        }}
    />
);

const debounce = (fn, delay) => {
    let timeout = -1;

    return (...args) => {
        if (timeout !== -1) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(fn, delay, ...args);
    };
};

const PannellumViewer = () => {
    const pannellumRef = useRef(null);
    const viewerRef = useRef(null); // Reference for the pannellum viewer
    const [scenes, setScenes] = useState({});
    const [currentScene, setCurrentScene] = useState(null);
    const [hotspotData, setHotspotData] = useState(null); // Store data for hotspot creation
    const [validationError, setValidationError] = useState('');
    const [mouseDownPosition, setMouseDownPosition] = useState(null);
    const [marker, setMarker] = useState(null);
    const [isIOS, setIsIOS] = useState(false); // State to track if the device is iOS
    const [isFullscreen, setIsFullscreen] = useState(false); // Track if fullscreen is active
    const originalStyle = useRef({}); // To store original styles for iOS full screen toggle

    // Detect if the user is on iOS, but only on the client side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            setIsIOS(/iPhone/.test(userAgent));
        }
    }, []);

    useEffect(() => {
        setMarker(null)
        // Cleanup function to remove old viewer instance and associated elements
        const cleanupViewer = () => {
            if (viewerRef.current) {
                viewerRef.current.destroy(); // Destroy the Pannellum viewer instance
            }
            if (pannellumRef.current) {
                // Optionally remove additional elements or perform other cleanup
                pannellumRef.current.innerHTML = ''; // Clear out previous content
            }
        };

        // Initialize or update the Pannellum viewer only after cleanup
        const initializeViewer = () => {
            if (pannellumRef.current && currentScene) {
                // Initialize or update the Pannellum viewer
                viewerRef.current = pannellum.viewer(pannellumRef.current, {
                    default: { firstScene: currentScene },
                    scenes,
                    autoLoad: true,
                });

                // Ensure the viewer is updated to its container size
                viewerRef.current.on('load', () => {
                    viewerRef.current.resize(); // Force resize to handle the image size correctly
                });

                // Listen to scene changes
                viewerRef.current.on('scenechange', (sceneId) => {
                    setCurrentScene(sceneId);
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
    }, [scenes, currentScene]);

    // Function to handle image upload
    const handleImageUpload = (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const newScenes = {};
        const filePromises = Array.from(files).map((file, index) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result; // Get the Base64 string
                    const sceneId = `scene${Object.keys(scenes).length + index + 1}`;

                    var fileName = file?.name?.split(".")[0];

                    // Create a new scene configuration with the base64 image
                    newScenes[sceneId] = {
                        // title: `Scene ${Object.keys(scenes).length + index + 1}`,
                        title: fileName,
                        type: 'equirectangular',
                        panorama: base64String, // Store the Base64 string here
                        hotSpots: [],
                        autoLoad: true, // Ensure auto loading for this scene
                    };

                    resolve();
                };
                reader.onerror = reject;
                reader.readAsDataURL(file); // Convert the file to a Base64 string
            });
        });

        // Wait for all file uploads (conversions) to complete
        Promise.all(filePromises).then(() => {
            // Add new scenes to the existing scenes state
            setScenes((prevScenes) => ({
                ...prevScenes,
                ...newScenes,
            }));

            // Automatically set the first new scene as the current scene to view it
            const firstNewSceneId = `scene${Object.keys(scenes).length + 1}`;
            setCurrentScene(firstNewSceneId);
        }).catch(error => console.error("Error uploading images:", error));
    };


    // Calculate the distance between two pitch and yaw coordinates
    const calculateDistance = (p1, y1, p2, y2) => {
        // Convert pitch and yaw to Cartesian coordinates
        const x1 = Math.cos(p1) * Math.cos(y1);
        y1 = Math.cos(p1) * Math.sin(y1);
        const z1 = Math.sin(p1);

        const x2 = Math.cos(p2) * Math.cos(y2);
        y2 = Math.cos(p2) * Math.sin(y2);
        const z2 = Math.sin(p2);

        // Calculate Euclidean distance
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
    };

    // Add a hotspot with the selected target scene
    const addHotspot = (pitch, yaw, targetSceneId) => {
        setMarker(null)
        const THRESHOLD = 0.05; // Define a threshold for distance in Cartesian coordinates
        let isTooClose = false;

        setScenes((prevScenes) => {
            // Create a new scenes object by copying the previous scenes
            const updatedScenes = { ...prevScenes };

            // Find the current scene and update only its hotspots
            if (updatedScenes[currentScene]) {
                // Check for existing hotspots
                const existingHotspots = updatedScenes[currentScene].hotSpots;

                // Validate against existing hotspots
                for (const hotspot of existingHotspots) {
                    const distance = calculateDistance(pitch, yaw, hotspot.pitch, hotspot.yaw);
                    if (distance < THRESHOLD) {
                        isTooClose = true;
                        break;
                    }
                }

                // Add the new hotspot only if it's not too close to any existing hotspots
                if (!isTooClose) {
                    // Make a copy of the current scene's hotspots
                    const newHotSpots = [...existingHotspots, {
                        pitch,
                        yaw,
                        type: 'scene',
                        text: `Go to ${scenes[targetSceneId]?.title}`,
                        sceneId: targetSceneId, // Link to the selected scene
                        title: scenes[targetSceneId]?.title
                    }];

                    // Update the current scene's hotSpots with the new array
                    updatedScenes[currentScene] = {
                        ...updatedScenes[currentScene],
                        hotSpots: newHotSpots,
                    };

                    setValidationError(''); // Clear any previous validation errors
                } else {
                    setValidationError('Hotspot too close to an existing one.');
                }
            }

            return updatedScenes; // Return the updated scenes object
        });

        if (!isTooClose) {
            setHotspotData(null); // Clear hotspot data after adding
        }
    };

    // Mock function to generate pitch/yaw from mouse click (requires further implementation for accuracy)
    const generatePitchYawFromClick = (event) => {
        if (viewerRef.current) {
            // Use mouseEventToCoords to get pitch and yaw
            const [pitch, yaw] = viewerRef.current.mouseEventToCoords(event);
            return { pitch, yaw };
        }
        return { pitch: 0, yaw: 0 }; // Fallback values
    };

    // Handle mouse down event
    const handleMouseDown = (event) => {
        // Check if the click is on the Pannellum control buttons
        if (event.target.closest('.pnlm-controls-container')) {
            return;
        }

        setMarker(null);
        setMouseDownPosition({ x: event.clientX, y: event.clientY });
    };

    // Handle mouse up event
    const handleMouseUp = (event) => {
        // Check if the click is on the Pannellum control buttons
        if (event.target.closest('.pnlm-controls-container')) {
            return;
        }

        if (mouseDownPosition) {
            const distance = Math.sqrt(
                (event.clientX - mouseDownPosition.x) ** 2 +
                (event.clientY - mouseDownPosition.y) ** 2
            );

            // If distance is small, consider it a click
            if (distance < 5) {
                if (Object.keys(scenes).length > 1) {
                    // Generate pitch and yaw from click event
                    const { pitch, yaw } = generatePitchYawFromClick(event);

                    const rect = pannellumRef.current.getBoundingClientRect();

                    // Calculate the relative x and y coordinates within the div
                    const relativeX = event.clientX - rect.left;
                    const relativeY = event.clientY - rect.top;

                    // Add marker to the list of markers
                    setMarker({ pitch, yaw, top: relativeY, left: relativeX });

                    setHotspotData({ pitch, yaw });
                } else {
                    alert("Upload another scene first to create a hotspot!");
                }
            }

            setMouseDownPosition(null); // Reset mouse down position
        }
    };

    const getAvailableScenesForHotspot = () => {
        if (!currentScene || !scenes[currentScene]) return [];

        const usedScenes = new Set(
            scenes[currentScene].hotSpots.map(hotspot => hotspot.sceneId)
        );

        return Object.keys(scenes).filter(sceneId => sceneId !== currentScene && !usedScenes.has(sceneId));
    };

    // Function to export scenes to a JSON file
    const exportHotspots = () => {
        const blob = new Blob([JSON.stringify(scenes, null, 2)], { type: 'application/json' });
        saveAs(blob, 'hotspots.json');
    };

    const importHotspots = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedScenes = JSON.parse(e.target.result);

                    // Optional: Validate if the panorama fields are Base64 strings
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

                    setScenes(sortedData);
                    setCurrentScene(Object.keys(sortedData)[0] || null); // Set the first scene as the current scene
                    // alert('Hotspots imported successfully!');
                } catch (error) {
                    console.error(error);
                    alert('Error importing hotspots. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    };

    // Handle title change
    const handleTitleChange = debounce((value, sceneId) => {
        scenes[sceneId].title = value;

        for (const scene in scenes) {
            const curr = scenes[scene];
            if (curr && curr.hotSpots && curr.hotSpots.length >= 1) {
                curr.hotSpots.forEach(q => {
                    if (q.sceneId === sceneId) {
                        q.title = value
                        q.text = `Go to ${value}`
                    }
                });
            }
        }

        setScenes({ ...scenes })
    }, 300);

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            if (isIOS) {
                // Save the original styles
                originalStyle.current = {
                    position: pannellumRef.current.style.position,
                    top: pannellumRef.current.style.top,
                    left: pannellumRef.current.style.left,
                    width: pannellumRef.current.style.width,
                    height: pannellumRef.current.style.height,
                    zIndex: pannellumRef.current.style.zIndex,
                };

                // Make the viewer full screen on iOS
                pannellumRef.current.style.position = 'fixed';
                pannellumRef.current.style.top = 0;
                pannellumRef.current.style.left = 0;
                pannellumRef.current.style.width = `${window.innerWidth}px`;
                pannellumRef.current.style.height = `${window.innerHeight}px`;
                // pannellumRef.current.style.width = '100vw';
                // pannellumRef.current.style.height = '100vh';
                pannellumRef.current.style.zIndex = 9999; // Bring it to the front
            }
            //  else {
            //     // Use the fullscreen API for other devices
            //     if (pannellumRef.current.requestFullscreen) {
            //         pannellumRef.current.requestFullscreen();
            //     } else if (pannellumRef.current.mozRequestFullScreen) { // Firefox
            //         pannellumRef.current.mozRequestFullScreen();
            //     } else if (pannellumRef.current.webkitRequestFullscreen) { // Chrome, Safari, Opera
            //         pannellumRef.current.webkitRequestFullscreen();
            //     } else if (pannellumRef.current.msRequestFullscreen) { // IE/Edge
            //         pannellumRef.current.msRequestFullscreen();
            //     }
            // }
            setIsFullscreen(true);
        } else {
            if (isIOS) {
                // Restore the original styles on iOS
                pannellumRef.current.style.position = originalStyle.current.position;
                pannellumRef.current.style.top = originalStyle.current.top;
                pannellumRef.current.style.left = originalStyle.current.left;
                pannellumRef.current.style.width = originalStyle.current.width;
                pannellumRef.current.style.height = originalStyle.current.height;
                pannellumRef.current.style.zIndex = originalStyle.current.zIndex;
            }
            //  else {
            //     // Exit fullscreen for other devices
            //     if (document.exitFullscreen) {
            //         document.exitFullscreen();
            //     } else if (document.mozCancelFullScreen) { // Firefox
            //         document.mozCancelFullScreen();
            //     } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
            //         document.webkitExitFullscreen();
            //     } else if (document.msExitFullscreen) { // IE/Edge
            //         document.msExitFullscreen();
            //     }
            // }
            setIsFullscreen(false);
        }
    };

    return (
        <div className={styles.container}>
            <div style={{ display: "flex", gap: 40 }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ marginBottom: 8 }}>Import saved file</p>
                    <FileUpload
                        placeholder={"Import file"}
                        className={styles.fileInput}
                        onChange={importHotspots}
                    />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ marginBottom: 8 }}>Upload new Images</p>
                    <FileUpload
                        id={"multiple-file"}
                        placeholder={"Choose Image(s)"}
                        className={styles.fileInput}
                        onChange={handleImageUpload}
                        accept="image/*"
                        isMultiple
                    />
                </div>
                {Object.keys(scenes).length > 0 && (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ marginBottom: 8 }}>Save and Export</p>
                        <Button onClick={exportHotspots} useIcon={false}>Save and Export</Button>
                    </div>
                )}
            </div>

            <div className={styles.viewContainer}>
                <ButtonScene scenes={scenes} setCurrentScene={setCurrentScene} />
                <div className={styles.panoViewer} >
                    <div
                        ref={pannellumRef}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                    >
                    </div>
                    {marker && (
                        <Marker className={styles.marker} position={marker} />
                    )}

                    {/* Custom Fullscreen Button */}
                    {
                        isIOS && scenes && Object.keys(scenes).length > 0 &&
                        <button onClick={toggleFullscreen} className={`${styles.fullScreenButtonDefault} ${isFullscreen ? styles.fullScreenButtonAfter : styles.fullScreenButtonBefore}`}>
                            {isFullscreen ? '[•]' : '[ ]'}
                        </button>
                    }

                </div>
            </div>
            {
                hotspotData && (
                    <div className={styles.hotspotLink}>
                        <div>
                            <h3>Link to a Scene</h3>
                            <p>Select a scene to link this marker to:</p>
                        </div>
                        <div className={styles.selectBox}>
                            <select
                                onChange={(e) => {
                                    const targetSceneId = e.target.value;
                                    if (targetSceneId) {
                                        addHotspot(hotspotData.pitch, hotspotData.yaw, targetSceneId);
                                    }
                                }}
                            >
                                <option value="">Select a Scene</option>
                                {/* Filter out scenes already used as hotspots in the current scene */}
                                {getAvailableScenesForHotspot().map((sceneId) => (
                                    <option key={sceneId} value={sceneId}>
                                        {scenes[sceneId].title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {validationError && <p className={styles.errorMessage}>{validationError}</p>}
                    </div>
                )
            }

            {Object.keys(scenes).length > 0 && (
                <div className={styles.manageScenes}>
                    <h2>Manage Scenes</h2>
                    <ViewHotspots
                        scenes={scenes}
                        setScenes={setScenes}
                        handleTitleChange={handleTitleChange}
                    />
                </div>
            )}
            {/* <div className={styles.exportImportSection}>
                <h3>Export</h3>
                <button onClick={exportHotspots}>Export Hotspots</button>
            </div> */}
        </div>
    );
};

export default PannellumViewer;
