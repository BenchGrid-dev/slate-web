"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import styles from "./demo-video.module.css";

const VIDEO_URL = "https://youtu.be/Mg-YcqKyDvs";

export default function DemoVideo() {
  const [playing, setPlaying] = useState(false);
  const player = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (playing) player.current?.focus();
  }, [playing]);

  return (
    <section id="demo-video" className={`page-width ${styles.section}`} aria-labelledby="demo-video-title">
      <div className={styles.heading}>
        <h2 id="demo-video-title">See Slate <em>in action.</em></h2>
        <a href={VIDEO_URL} target="_blank" rel="noreferrer">
          Watch on YouTube <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
      <div className={styles.frame}>
        {playing ? (
          <iframe
            ref={player}
            src="https://www.youtube-nocookie.com/embed/Mg-YcqKyDvs?autoplay=1&playsinline=1&rel=0"
            title="Meet SlateOS: a Linux desktop natively built for humans and AI agents — live demo"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button className={styles.cover} onClick={() => setPlaying(true)} aria-label="Play the SlateOS demo video">
            <img src="/slate-demo-video-poster.jpg" width={1280} height={720} alt="" aria-hidden="true" loading="lazy" decoding="async" />
            <span className={styles.play}>
              <Play size={20} fill="currentColor" aria-hidden="true" />
              Watch the demo
            </span>
            <span className={styles.duration}>1:28</span>
          </button>
        )}
      </div>
    </section>
  );
}
