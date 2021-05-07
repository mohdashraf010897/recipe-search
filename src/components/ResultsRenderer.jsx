import { Col, Empty, Row, Spin } from "antd";
import React from "react";
import CardItem from "./CardItem";
import InfiniteScrollContainer from "./InfiniteScrollContainer";
import PromotedCardItem from "./PromotedCardItem";

let currentPage = 0; //current page number; used for scroll pagination
const ResultsRenderer = ({
  results = [],
  promotedData = [],
  loading = false,
  size = 0,
  setFrom = () => console.log("Pass a function to implement pagination"),
  setfullRecipe = () =>
    console.log("Pass a function to open full recipe- modal"),
}) => {
  return (
    <>
      {" "}
      {!results.data.length ? (
        <Empty
          description={
            <span>{loading ? "Fetching Data!" : "No Results Found!"}</span>
          }
        ></Empty>
      ) : (
        <Col span={24} className="result-time-status">
          {" "}
          <p>
            <strong style={{ color: "red" }}>
              {new Intl.NumberFormat("en-US", {
                maximumSignificantDigits: 3,
              }).format(results.numberOfResults)}
            </strong>{" "}
            results found in{" "}
            <strong style={{ color: "red" }}>
              {typeof results.time == "object"
                ? results.time.took
                : results.time}
            </strong>{" "}
            ms
          </p>
        </Col>
      )}
      <InfiniteScrollContainer
        callNextPage={() => {
          if (Math.floor(results.numberOfResults / size) >= currentPage) {
            currentPage++;
            setFrom(currentPage * size);
          }
        }}
        loading={loading}
      >
        <div className="result-list-container">
          <Spin spinning={loading}>
            <Row
              gutter={[16, 16]}
              wrap
              justify="flex-start"
              className="result-row"
            >
              {promotedData?.map((promotedItem) => (
                <PromotedCardItem key={promotedItem.id} item={promotedItem} />
              ))}
              {results.data?.slice(1).map((item) => {
                return (
                  <CardItem
                    key={item.id * Math.random()}
                    item={item}
                    setfullRecipe={setfullRecipe}
                  />
                );
              })}
            </Row>
          </Spin>{" "}
        </div>
      </InfiniteScrollContainer>
    </>
  );
};

export default ResultsRenderer;
