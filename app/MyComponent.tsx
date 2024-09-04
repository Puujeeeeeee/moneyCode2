"use client";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const MyComponent = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Render nothing until the component is mounted
  }

  return (
    <div>
      <button onClick={() => router.push("/somepage")}>Go to Some Page</button>
    </div>
  );
};

export default MyComponent;
