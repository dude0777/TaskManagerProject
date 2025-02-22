import { useWindowSize } from '../../hooks/useWindowSize';
import styles from './BackgroundCircles.module.css';

const BackgroundCircles = () => {
  const { isMobile } = useWindowSize();

  return (
    <div className={styles.circlesContainer}>
      {isMobile ? (
        <svg 
          className={styles.mobileSvg}
          width="360" 
          height="741" 
          viewBox="0 0 360 741" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path opacity="0.5" d="M424.636 13C424.636 54.2228 391.442 87.6363 350.5 87.6363C309.558 87.6363 276.364 54.2228 276.364 13C276.364 -28.2228 309.558 -61.6363 350.5 -61.6363C391.442 -61.6363 424.636 -28.2228 424.636 13Z" stroke="#7B1984" strokeWidth="0.727435"/>
          <path opacity="0.5" d="M47.6363 231C47.6363 272.223 14.442 305.636 -26.5 305.636C-67.442 305.636 -100.636 272.223 -100.636 231C-100.636 189.777 -67.442 156.364 -26.5 156.364C14.442 156.364 47.6363 189.777 47.6363 231Z" stroke="#7B1984" strokeWidth="0.727435"/>
          <path d="M409.636 13C409.636 45.3782 382.942 71.6363 350 71.6363C317.058 71.6363 290.364 45.3782 290.364 13C290.364 -19.3782 317.058 -45.6363 350 -45.6363C382.942 -45.6363 409.636 -19.3782 409.636 13Z" stroke="#7B1984" strokeWidth="0.727435"/>
          <path d="M32.6363 231C32.6363 263.378 5.94199 289.636 -27 289.636C-59.942 289.636 -86.6363 263.378 -86.6363 231C-86.6363 198.622 -59.942 172.364 -27 172.364C5.94199 172.364 32.6363 198.622 32.6363 231Z" stroke="#7B1984" strokeWidth="0.727435"/>
          <circle opacity="0.5" cx="352.5" cy="15.5" r="88.1363" stroke="#7B1984" strokeWidth="0.727435"/>
          <circle opacity="0.5" cx="-24.5" cy="233.5" r="88.1363" stroke="#7B1984" strokeWidth="0.727435"/>
          <path opacity="0.5" d="M255.636 650.5C255.636 691.449 222.887 724.636 182.5 724.636C142.113 724.636 109.364 691.449 109.364 650.5C109.364 609.551 142.113 576.364 182.5 576.364C222.887 576.364 255.636 609.551 255.636 650.5Z" stroke="#7B1984" strokeWidth="0.727435"/>
          <path d="M242.636 650C242.636 682.378 215.942 708.636 183 708.636C150.058 708.636 123.364 682.378 123.364 650C123.364 617.622 150.058 591.364 183 591.364C215.942 591.364 242.636 617.622 242.636 650Z" stroke="#7B1984" strokeWidth="0.727435"/>
          <circle opacity="0.5" cx="185.5" cy="652.5" r="88.1363" stroke="#7B1984" strokeWidth="0.727435"/>
        </svg>
      ) : (
        <svg 
          className={styles.desktopSvg}
          width="2945" 
          height="673" 
          viewBox="0 0 745 773" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle opacity="0.5" cx="403.841" cy="407.1" r="352.442" stroke="#7B1984" strokeWidth="0.727435"/>
          <circle cx="404.206" cy="405.282" r="280.063" stroke="#7B1984" strokeWidth="0.727435"/>
          <circle opacity="0.5" cx="418.026" cy="417.648" r="416.82" stroke="#7B1984" strokeWidth="0.727435"/>
        </svg>
      )}
    </div>
  );
};

export default BackgroundCircles;