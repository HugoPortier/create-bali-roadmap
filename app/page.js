"use client";
import React, { useState, useRef, useEffect } from "react";
import BaliMap from "@/public/Carte-de-Bali.svg";
import BaliMapjpg from "@/public/Carte-de-Bali.jpg";
import Image from "next/image";

const Home = () => {
  const [markers, setMarkers] = useState([]);
  const [nextId, setNextId] = useState(1);
  const containerRef = useRef(null);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const handleClick = (e) => {
    if (e.target.tagName === "circle" || isDragging) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - transform.x) / transform.scale;
    const y = (e.clientY - rect.top - transform.y) / transform.scale;

    setMarkers([...markers, { id: nextId, x, y }]);
    setNextId(nextId + 1);
  };

  const removeMarker = (id) => {
    setMarkers(markers.filter((marker) => marker.id !== id));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const scale = Math.max(1, Math.min(5, transform.scale - e.deltaY * 0.01));
    setTransform({ ...transform, scale });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startPosition.x;
    const dy = e.clientY - startPosition.y;
    setTransform({ ...transform, x: transform.x + dx, y: transform.y + dy });
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging, startPosition]);

  return (
    <div className="p-4 m-4 bg-orange-500">
      <h1 className="text-2xl font-bold mb-4">
        Planificateur de voyage à Bali
      </h1>
      <div
        ref={containerRef}
        className="relative w-full h-[75vh] overflow-hidden touch-none"
        onClick={handleClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: "0 0",
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            src={BaliMapjpg}
            alt="Carte de Bali"
            layout="fill"
            objectFit="contain"
          />
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {/* Lignes entre les marqueurs */}
            {markers.map((marker, index) => {
              if (index === 0) return null;
              const prevMarker = markers[index - 1];
              return (
                <line
                  key={`line-${marker.id}`}
                  x1={prevMarker.x}
                  y1={prevMarker.y}
                  x2={marker.x}
                  y2={marker.y}
                  stroke="blue"
                  strokeWidth={2 / transform.scale}
                />
              );
            })}

            {/* Marqueurs */}
            {markers.map((marker, index) => (
              <g
                key={marker.id}
                transform={`translate(${marker.x},${marker.y})`}
              >
                <circle
                  r={10 / transform.scale}
                  fill="purple"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeMarker(marker.id);
                  }}
                  style={{ cursor: "pointer", pointerEvents: "auto" }}
                />
                <text
                  dy=".3em"
                  textAnchor="middle"
                  fill="white"
                  fontSize={10 / transform.scale}
                >
                  {index + 1}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Home;
