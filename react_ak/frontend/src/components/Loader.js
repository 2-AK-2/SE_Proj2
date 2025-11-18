// src/components/Loader.js
import React from "react";

const Loader = () => {
  return (
    <span
      style={{
        display: "inline-block",
        width: 16,
        height: 16,
        border: "2px solid #fff",
        borderRadius: "50%",
        borderTopColor: "transparent",
        animation: "spin 1s linear infinite",
      }}
    />
  );
};

// inject keyframes if not present
try {
  const styleSheet = document.styleSheets[0];
  const spinRule = "@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }";
  if (styleSheet && styleSheet.insertRule) styleSheet.insertRule(spinRule, styleSheet.cssRules.length);
} catch (e) {
  // ignore
}

export default Loader;
