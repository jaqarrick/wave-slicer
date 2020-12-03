import React from "react";
import { Global, css } from "@emotion/core";
import emotionNormalize from "emotion-normalize";

export const colors = {
  light: "#FAFAF9",
  dark: "#474468",
};

export const GlobalStyles = (props) => (
  <Global
    {...props}
    styles={css`
      ${emotionNormalize}
      html {
        box-sizing: border-box;
        background-color: ${colors.light};
        font-family: "jostmedium", verdana;
        font-weight: medium;
      }
      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }
      body {
        height: 100vh;
        margin: auto;
        overflow: hidden;
      }

      #root {
        height: 100vh;
      }

      input[type="range"] {
        -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
        width: 100%; /* Specific width is required for Firefox. */
        background: transparent; /* Otherwise white in Chrome */
      }

      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
      }

      input[type="range"]:focus {
        outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
      }

      input[type="range"]::-ms-track {
        width: 100%;
        cursor: pointer;

        /* Hides the slider so custom styles can be added */
        background: transparent;
        border-color: transparent;
        color: transparent;
      }

      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 30px;
        width: 30px;
        background: ${colors.light};
        cursor: pointer;
        border-radius: none;
        margin-top: 2px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
      }

      /* All the same stuff for Firefox */
      input[type="range"]::-moz-range-thumb {
        height: 30px;
        width: 30px;
        background: ${colors.light};
        cursor: pointer;
        border-radius: none;
      }

      /* All the same stuff for IE */
      input[type="range"]::-ms-thumb {
        height: 30px;
        width: 30px;
        background: ${colors.light};
        cursor: pointer;
        border-radius: none;
      }

      input[type="range"]::-webkit-slider-runnable-track {
        width: 100%;
        height: 34px;
        cursor: pointer;
        background: ${colors.dark};
        border-right: solid 2px ${colors.dark};
        border-left: solid 2px ${colors.dark};
      }

      input[type="range"]:focus::-webkit-slider-runnable-track {
        background: ${colors.dark};
        border-right: solid 2px ${colors.dark};
        border-left: solid 2px ${colors.dark};
      }

      input[type="range"]::-moz-range-track {
        width: 100%;
        height: 34px;
        cursor: pointer;
        background: ${colors.dark};
        border-right: solid 2px ${colors.dark};
        border-left: solid 2px ${colors.dark};
        box-sizing: border-box;
      }

      input[type="range"]::-ms-track {
        width: 100%;
        height: 34px;
        cursor: pointer;
        background: transparent;
        border-color: transparent;
        border-width: 16px 0;
        color: transparent;
      }
      input[type="range"]::-ms-fill-lower {
      }
      input[type="range"]:focus::-ms-fill-lower {
        background: ${colors.dark};
      }
      input[type="range"]::-ms-fill-upper {
        background: ${colors.dark};
      }
      input[type="range"]:focus::-ms-fill-upper {
      }
    `}
  />
);
