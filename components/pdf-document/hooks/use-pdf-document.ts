"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useDevicePixelRatio } from "./use-device-pixel-ratio";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

export const usePdfDocument = ({ url, actions }: { url: string; actions: ReactNode }) => {
  const [pages, setPages] = useState(0);
  const [failed, setFailed] = useState(false);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [width, setWidth] = useState(0);
  const devicePixelRatio = useDevicePixelRatio();
  const viewport = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const resize = () => setWidth(Math.max(1, element.clientWidth - 32));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const changePage = (next: number) => {
    setPage(Math.max(1, Math.min(pages, next)));
    viewport.current?.scrollTo({
      top: 0,
      left: 0,
    });
  };
  return {
    page,
    pages,
    changePage,
    failed,
    zoom,
    setZoom,
    viewport,
    actions,
    url,
    setPages,
    setFailed,
    width,
    devicePixelRatio,
  };
};
