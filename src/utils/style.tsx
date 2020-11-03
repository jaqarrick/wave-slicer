import React from "react";
import styled from "@emotion/styled";
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
        font-family: "JostMedium";
        font-weight: medium;
      }
      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }
      body {
        height: 100vh;
        max-width: 1100px;
        margin: auto;
      }
    `}
  />
);
