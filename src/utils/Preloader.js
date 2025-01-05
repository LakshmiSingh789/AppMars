// Preloader.js

import React from "react";

const Preloader = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f8f9fa" }}>
      <div style={{ width: "3rem", height: "3rem", border: "0.4rem solid #e9ecef", borderTop: "0.4rem solid #007bff", borderRadius: "50%", animation: "spin 1s linear infinite" }} role="status">
        <span style={{ position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", border: "0" }}>Loading...</span>
      </div>
    </div>
  );
};

export default Preloader;
