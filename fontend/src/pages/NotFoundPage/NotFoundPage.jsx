import React from "react";
import "./NotFoundPage.css";
export default function NotFoundPage() {
  return (
    <div>
      <div className="center-title">
        <div className="gif-404">
          <img src="https://i.postimg.cc/2yrFyxKv/giphy.gif" alt="gif_ing" />
        </div>
        <div className="content-404">
          <h1 className="main-heading">This page is gone.</h1>
          <p>
            ...maybe the page you're looking for is not found or never existed.
          </p>

          <button
            className="button-primary mt-3"
            style={{
              padding: "12px 8px",
            }}
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Back to home{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
