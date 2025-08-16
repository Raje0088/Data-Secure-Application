import React, { Fragment } from "react";
import styles from "./CustomInput.module.css";
const CustomInput = ({
  type = "text",
  name = "",
  label="Raj",
  value,
  onChange,
  placeholder="",
  required = false,
  readonly =false,
  min=0,
}) => {
  return (
      <div className={styles.inputbox}>
        <label htmlFor={name}>{label}</label>
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          readOnly={readonly}
          min={min}
        />
      </div>
  );
};

export default CustomInput;
