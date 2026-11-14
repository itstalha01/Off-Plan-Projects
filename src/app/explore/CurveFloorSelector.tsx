"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Maximize2 } from "lucide-react";
import type { FloorPlan } from "@/features/projects/types/project";
import styles from "./explore.module.css";

export function CurveFloorSelector({
  facade,
  floors,
  projectUrl,
}: {
  facade: string;
  floors: [FloorPlan, FloorPlan];
  projectUrl: string;
}) {
  const [selected, setSelected] = useState(0);
  const floor = floors[selected];

  return (
    <div className={styles.floorSelector}>
      <div>
        <h3>Explore Curve by floor</h3>
        <p className={styles.floorHint}>Tap a highlighted level or choose a floor to see its plan.</p>
        <div className={styles.floorButtons} role="group" aria-label="Curve floors">
          {floors.map(({ label }, index) => (
            <button key={label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>
              {label}
            </button>
          ))}
        </div>
        <div className={styles.facade}>
          <Image src={facade} alt="Architectural rendering of Curve’s street-facing façade" fill sizes="(max-width: 800px) 90vw, 650px" />
          {floors.map(({ label }, index) => (
            <button
              key={label}
              type="button"
              className={styles.floorZone}
              aria-label={`Show ${label} plan from the façade`}
              aria-pressed={selected === index}
              data-floor={index === 0 ? "ground" : "first"}
              onClick={() => setSelected(index)}
            />
          ))}
        </div>
      </div>

      <figure className={styles.floorDrawing}>
        <a href={floor.img} target="_blank" rel="noopener" aria-label={`Open ${floor.label} plan at full size in a new tab`} className={styles.planPreview}>
          {floors.map(({ label, img }, index) => (
            <Image key={img} src={img} alt={selected === index ? `${label} plan for Curve` : ""} fill sizes="(max-width: 800px) 90vw, 530px" data-visible={selected === index} />
          ))}
          <span className={styles.enlarge} aria-hidden="true"><Maximize2 size={18} /></span>
        </a>
        <figcaption>
          <strong aria-live="polite">{floor.label}</strong>
          <Link className={styles.link} href={`${projectUrl}/floor-plans`}>View project floor plans <ArrowUpRight aria-hidden="true" size={16} /></Link>
        </figcaption>
      </figure>
    </div>
  );
}
