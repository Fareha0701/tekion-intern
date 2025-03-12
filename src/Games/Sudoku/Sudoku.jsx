import React from "react";
function Sudoku() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <iframe
        // width="560"
        // height="315"
        // width="100%"
        // height="100%"
        style={{ width: "100vw", height: "100vh" }}
        // src="http://127.0.0.1:5500/sudoku_task2/sudoku.html"
        src="http://127.0.0.1:5501/sudoku.html"
      />
    </div>
  );
}
export default Sudoku;
