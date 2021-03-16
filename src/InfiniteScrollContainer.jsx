import React, { useState, useEffect, useRef } from "react";

const InfiniteScrollContainer = ({ children, callNextPage }) => {
  let loadingRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [prevY, setPrevY] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  let observer;

  const handleObserver = (entities, observer) => {
    const y = entities[0].boundingClientRect.y;
    if (prevY > y) {
      callNextPage(currentPage + 1);
      setCurrentPage(currentPage + 1);
    }
    setPrevY(y);
  };
  useEffect(() => {
    var options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    observer = new IntersectionObserver(handleObserver, options);
    observer.observe(loadingRef);
  }, []);

  const loadingCSS = {
    height: "100px",
    margin: "30px",
  };
  const loadingTextCSS = { display: loading ? "block" : "none" };

  return (
    <div id="under-observation">
      <>{children}</>
      <div ref={(ref) => (loadingRef = ref)} style={loadingCSS}>
        <span style={loadingTextCSS}>Loading...</span>
      </div>
    </div>
  );
};

export default InfiniteScrollContainer;
