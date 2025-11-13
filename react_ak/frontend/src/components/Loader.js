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

// ✅ Inline keyframes (inject into document once)
const styleSheet = document.styleSheets[0];
if (styleSheet && styleSheet.insertRule) {
  const spinRule =
    "@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }";
  try {
    styleSheet.insertRule(spinRule, styleSheet.cssRules.length);
  } catch (e) {
    // silent fail if already added
  }
}

export default Loader;
