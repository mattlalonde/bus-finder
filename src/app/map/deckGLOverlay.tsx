"use client";

import { DeckProps } from "@deck.gl/core";
import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { useApiIsLoaded, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useMemo } from "react";

export function DeckGLOverlay(props: DeckProps) {
  const map = useMap();
  const apiIsLoaded = useApiIsLoaded();

  const overlay = useMemo(
    () => new GoogleMapsOverlay({ interleaved: true }),
    []
  );

  useEffect(() => {
    if (!map || !apiIsLoaded) return;

    const p = map.getProjection();

    overlay.setMap(map);
    return () => overlay.setMap(null);
  }, [map, apiIsLoaded]);

  useEffect(() => overlay.setProps(props), [props, overlay]);

  /* overlay.setProps(props); */
  return null;
}
