import Button from './Button';
import styles from './ButtonScene.module.css';

const ButtonScene = ({ scenes, setCurrentScene }) => {
    if (Object.keys(scenes).length <= 0) {
        return <></>
    }

    return (
        <div className={styles.sceneNavigation}>
            <h2>Select Scene:</h2>
            <ul className={styles.sceneList}>
                {Object.keys(scenes).map(sceneId => (
                    <li key={sceneId}>
                        <Button useIcon={false} onClick={() => setCurrentScene(sceneId)} colorId={1}>
                            {scenes[sceneId].title}
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ButtonScene;
