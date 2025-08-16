import React from "react";
import styles from "./Backup.module.css";

const Backup = () => {
  const openInput = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (event) => {
      const selectedFile = event.target.files[0];
      console.log("file name", selectedFile.name);
    };
    input.click();
  };
  return (
    <div className={styles.main}>
      <div className={styles["backup-box"]}>
        <div className={styles.content}>
          <h2 className={styles.header}>Backup Data</h2>
        </div>
        <div className={styles.content}>
          <span className={styles["span-content"]}>
            <label htmlFor="">UserId</label>
            <input type="text" className={styles["input-box"]}  />
          </span>
          <span className={styles["span-content"]}>
            <label htmlFor="">Password</label>
            <input type="password" className={styles["input-box"]} />
          </span>
        </div>
        <div>
          <button
            className={styles["input-button"]}
            onClick={() => {
              openInput();
            }}
          >
            Restore
          </button>
          <button className={styles["input-button"]}>Backup</button>
        
        </div>
      </div>
    </div>
  );
};

export default Backup;
