import { Spin } from "antd";
import React, { useState, useEffect, useRef } from "react";

let prevY = 0;
const InfiniteScrollContainer = ({ children, callNextPage, loading }) => {
  let loadingRef = useRef(null);

  let observer;

  const handleObserver = (entities, observer) => {
    const y = entities[0].boundingClientRect.y;

    if (prevY > y) {
      callNextPage();
    }
    prevY = y;
  };
  useEffect(() => {
    var options = {
      root: document.getElementById("under-observation"),
      rootMargin: "0px",
      threshold: 1.0,
    };

    observer = new IntersectionObserver(handleObserver, options);
    observer.observe(loadingRef);
  }, []);

  // useEffect(() => {

  //   if(resetScroll){// set scroll position in px
  //   loadingRef.scrollLeft = 300;
  //   loadingRef.scrollTop = 500;}
  // }, [resetScroll])

  const loadingCSS = {
    height: "100px",
    margin: "30px",
    padding: 50,
  };
  const loadingTextCSS = { display: loading ? "block" : "none" };

  return (
    <div
      id="under-observation"
      style={{ maxHeight: "70vh", overflowY: "scroll", overflowX: "hidden" }}
    >
      <>{children}</>
      <div ref={(ref) => (loadingRef = ref)} style={loadingCSS}>
        <Spin
          delay={500}
          spinning={loading}
          size="large"
          tip="Fetching Results"
        ></Spin>
      </div>
    </div>
  );
};

export default InfiniteScrollContainer;
