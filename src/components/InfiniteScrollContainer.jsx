import { Spin } from "antd";
import React from "react";
import { SearchContext } from "@appbaseio/react-searchbox";

let observer;
let prevY = 0;
class InfiniteScrollContainer extends React.Component {
  static contextType = SearchContext;
  constructor(props) {
    super(props);
    this.loadingRef = React.createRef();
  }
  handleObserver = (entities, observer) => {
    const y = entities[0].boundingClientRect.y;

    if (prevY > y) {
      this.props.callNextPage(
        this.context._components["result-component"].setAfter
      );
    }
    prevY = y;
  };
  componentDidMount() {
    var options = {
      root: document.getElementById("under-observation"),
      rootMargin: "0px",
      threshold: 1.0,
    };

    this.observer = new IntersectionObserver(this.handleObserver, options);
    this.observer.observe(this.loadingRef.current);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.context._components["result-component"].from == 0) {
      document.getElementById("under-observation").scrollTo(0, 0);
    }
  }

  render() {
    const loadingCSS = {
      height: "100px",
      margin: "30px",
      padding: 50,
    };
    const { children, callNextPage, loading } = this.props;
    return (
      <div
        id="under-observation"
        style={{ maxHeight: "70vh", overflowY: "scroll", overflowX: "hidden" }}
      >
        <>{children}</>
        <div ref={this.loadingRef} style={loadingCSS}>
          <Spin
            delay={500}
            spinning={loading}
            size="large"
            tip="Fetching Results"
          ></Spin>
        </div>
      </div>
    );
  }
}

export default InfiniteScrollContainer;
