"use client";

import React, { useMemo } from "react";

/**
 * MountainVistaParallax - self-contained animated parallax background
 * - Injects required keyframes and base CSS via a <style> tag so this component
 *   works without external CSS changes.
 * - Use this component as a background layer in the Problem & Impact hero.
 */

const layersData = [
  { className: "layer-6", speed: "120s", size: "222px", zIndex: 1, image: "6" },
  { className: "layer-5", speed: "95s",  size: "311px", zIndex: 1, image: "5" },
  { className: "layer-4", speed: "75s",  size: "468px", zIndex: 1, image: "4" },
  // bikes are foreground moving elements (no-repeat)
  { className: "bike-1",  speed: "10s",  size: "75px",  zIndex: 2, image: "bike", animation: "parallax_bike", bottom: "100px", noRepeat: true },
  { className: "bike-2",  speed: "15s",  size: "75px",  zIndex: 2, image: "bike", animation: "parallax_bike", bottom: "100px", noRepeat: true },
  { className: "layer-3", speed: "55s",  size: "158px", zIndex: 3, image: "3" },
  { className: "layer-2", speed: "30s",  size: "145px", zIndex: 4, image: "2" },
  { className: "layer-1", speed: "20s",  size: "136px", zIndex: 5, image: "1" },
];

const MountainVistaParallax = ({ title = "", subtitle = "" }: { title?: string; subtitle?: string }) => {
  // Construct dynamic CSS for layers + base rules + keyframes.
  const dynamicStyles = useMemo(() => {
    const base = `
      /* base container & layer rules */
      .mv-hero-container { position: relative; overflow: hidden; width: 100%; height: 100%; }
      .mv-parallax-layer {
        position: absolute;
        left: 0;
        top: 0;
        width: 200%;
        height: 120%;
        background-position: 0 100%;
        background-repeat: repeat-x;
        background-size: cover;
        will-change: transform, background-position;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        pointer-events: none;
      }
      .mv-parallax-layer.no-repeat { background-repeat: no-repeat; background-size: contain; }
      .mv-hero-content { position: relative; z-index: 50; } /* ensure foreground content stays on top */
      
      /* Keyframes for horizontal parallax movement (repeat-x) */
      @keyframes parallax_fg {
        0% { background-position: 2765px 100%; }
        100% { background-position: 550px 100%; }
      }
      /* Bike foreground animation - left to right */
      @keyframes parallax_bike {
        0% { background-position: -300px 100%; }
        100% { background-position: 2000px 100%; }
      }
    `;

    const layerCss = layersData
      .map((layer) => {
        const url = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/24650/${layer.image}.png`;
        return `.${layer.className}.mv-parallax-layer { ${layer.noRepeat ? "background-repeat: no-repeat;" : ""} ${layer.bottom ? `bottom: ${layer.bottom};` : ""} animation-name: ${layer.animation ? layer.animation : "parallax_fg"}; animation-duration: ${layer.speed}; z-index:${layer.zIndex}; background-size: auto ${layer.size}; background-image: url('${url}'); }`;
      })
      .join("\n");

    return base + "\n" + layerCss;
  }, []);

  return (
    <section
      className="mv-hero-container"
      aria-label="Animated parallax background for Problem & Impact hero"
    >
      {/* Inject styles (self-contained) */}
      <style>{dynamicStyles}</style>

      {/* Render the layers in DOM order (furthest back first) */}
      {layersData.map((layer) => (
        <div
          key={layer.className}
          aria-hidden="true"
          className={`mv-parallax-layer ${layer.className} ${layer.noRepeat ? "no-repeat" : ""}`}
        />
      ))}

      {/* Keep hero content within the same container so placement is easy on the page */}
      <div className="mv-hero-content">
        {title ? <h2 className="mv-hero-title">{title}</h2> : null}
        {subtitle ? <p className="mv-hero-subtitle">{subtitle}</p> : null}
      </div>
    </section>
  );
};

export default React.memo(MountainVistaParallax);