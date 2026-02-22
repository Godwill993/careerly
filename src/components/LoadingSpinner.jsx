import React from 'react';
import styles from '../styles/LoadingSpinner.module.css';

const LoadingSpinner = ({ message = "Loading...", fullHeight = false }) => {
  return (
    <div className={`${styles.spinnerContainer} ${fullHeight ? styles.fullHeight : ''}`}>
      <div className={styles.spinner}></div>
      <p className={styles.spinnerText}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
