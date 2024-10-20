import styles from './Button.module.css';

const Button = ({ children, onClick, useIcon = true, iconPosition = 'right', colorId = 2, style }) => {
    const getColor = () => {
        switch (colorId) {
            case 1:
                return {
                    button: styles.primary,
                    icon: styles.iconPrimary
                };
            case 2:
            default:
                return {
                    button: styles.danger,
                    icon: styles.iconDanger
                };
        }
    }

    return (
        <button className={`${styles.button} ${getColor().button}`} onClick={onClick} style={style}>
            {useIcon && iconPosition === "left" && (
                <svg fill="currentColor" viewBox="0 0 24 24" className={`${styles.icon} ${styles.iconleft} ${getColor().icon}`}>
                    <path
                        clipRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                        fillRule="evenodd"
                    ></path>
                </svg>
            )}
            {children}
            {useIcon && iconPosition === "right" && (
                <svg fill="currentColor" viewBox="0 0 24 24" className={`${styles.icon} ${getColor().icon}`}>
                    <path
                        clipRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                        fillRule="evenodd"
                    ></path>
                </svg>
            )}
        </button>
    );
};

export default Button;
