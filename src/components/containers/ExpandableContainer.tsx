"use client";

import React, { useState } from "react";
import styles from "./ExpandableContainer.module.css";

interface ExpandableContainerProps {
  title: string;
  contents: string[];
  isExpandable?: boolean;
  isExpandedInitially?: boolean;
  children?: React.ReactNode;
}

const ExpandableContainer: React.FC<ExpandableContainerProps> = ({
  title,
  contents,
  children,
  isExpandedInitially = false,
  isExpandable = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(isExpandedInitially);

  const handleExpandContainer = () => {
    setIsExpanded(!isExpanded);
  };

  const getSpanValue = () => {
    return isExpanded ? "See less" : "See more";
  };

  return (
    <>
      <div className={styles.headingContainer}>
        <h1 className={styles.containerHeading}>{title}</h1>
        {isExpandable && (
          <span onClick={handleExpandContainer}>{getSpanValue()}</span>
        )}
      </div>

      <div
        className={
          isExpanded
            ? styles.expandableContainerExpanded
            : styles.expandableContainer
        }
      >
        <div className={styles.ownContent}>
          <ul>
            {contents.map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
        </div>

        {children && <div className={styles.childrenContainer}>{children}</div>}
      </div>
    </>
  );
};

export default ExpandableContainer;
