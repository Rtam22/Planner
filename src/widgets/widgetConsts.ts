import type { CSSProperties } from "react";

export const baseLayout: CSSProperties = {
  backgroundColor: "white",
  width: "100%",
  maxWidth: "600px",
  height: "400px",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  overflow: "hidden",
  borderRadius: "10px",
  minWidth: "0",
  border: "solid 1px rgb(186, 185, 185)",
};

export const innerContainer: CSSProperties = {
  width: "100%",
  height: "100%",
  padding: "0px 15px 15px 15px",
  borderRadius: "5px",
  overflowX: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

export const splitContainer: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px",
};

export const centeredContainer: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  padding: "8px",
};
