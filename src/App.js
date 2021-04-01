import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Spin,
  Tag,
  Empty,
  Card,
  Divider,
  Tooltip,
  Button,
} from "antd";
import {
  SearchBox,
  SearchBase,
  SearchComponent,
} from "@appbaseio/react-searchbox";
import "./App.css";

import "./styles.css";
import Layout from "antd/lib/layout/layout";
import Meta from "antd/lib/card/Meta";
import { PlusCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons";
import IngredientIcon from "./assets/images/ingredients.svg";
import OvenGloveIcon from "./assets/images/oven-glove.svg";
import RecipeFullView from "./RecipeFullView.js";
import InfiniteScrollContainer from "./InfiniteScrollContainer";

const CardItem = ({ item, setfullRecipe }) => (
  <Col flex="0 0 auto" key={item._key}>
    {" "}
    <Card
      style={{ width: 300, height: 250 }}
      bodyStyle={{ padding: "10px 0" }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "40px",
          }}
        >
          <h3
            style={{
              // color: `hsla(${
              //   Math.random() * 360
              // }, 100%, 50%, 1)`,
              height: "auto",
              whiteSpace: "pre-wrap",
              marginBottom: "0px",
              lineHeight: "22px",
              fontSize: "14px",
              // paddingTop: "14px",
              color: "#ff7f7f",
            }}
            dangerouslySetInnerHTML={{
              __html: item.title.trim().replace("/(*)/g", ""),
            }}
          ></h3>
        </div>
      }
    >
      <Meta
        style={{
          textAlign: "left",
          height: 104,
          overflow: "hidden",
          display: "-webkit-box",
          webkitLineClamp: 4,
          webkitBoxOrient: "vertical",
          padding: "5px 15px",
        }}
        description={
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gridColumnGap: "14px",
              flexWrap: "wrap",
              gridRowGap: "4px",
            }}
          >
            {item?.NER?.map((item, idx) => {
              return (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gridGap: "4px",
                  }}
                  key={idx}
                >
                  <img src={IngredientIcon} height="15px" />
                  {item[0].toUpperCase() + item.substring(1)}
                </span>
              );
            })}
          </span>
        }
      />
      <Divider style={{ margin: "12px 0 10px" }} />
      <Meta
        style={{
          textAlign: "left",
          padding: "7px",
        }}
        description={
          <Row justify="space-between">
            <Col
              span={12}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {" "}
              <span>
                <img
                  src={require("./assets/images/external-link.png").default}
                  height="25px"
                />
                <a href={"https://" + item.link} target="_blank">
                  Recipe Origin
                </a>
              </span>
            </Col>
            <Col span={8} pull={4}>
              <Tooltip title="See Full Recipe!">
                <Button
                  onClick={() =>
                    setfullRecipe({
                      isModalVisible: true,
                      recipeItem: item,
                    })
                  }
                  style={{
                    paddingLeft: "10px",
                  }}
                  icon={
                    <img
                      src={OvenGloveIcon}
                      height="20px"
                      style={{
                        marginRight: "7px",
                      }}
                    />
                  }
                >
                  View Recipe
                </Button>
              </Tooltip>
            </Col>
          </Row>
        }
      />
    </Card>
  </Col>
);

const { CheckableTag } = Tag;
let pageChange = false,
  currentPage = 0;
export default () => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [fullRecipe, setfullRecipe] = useState({
    isModalVisible: false,
    recipeItem: {},
  });

  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [showAllFilters, setShowAllFilters] = useState(false);

  useEffect(() => {
    if (window?.innerWidth <= 600) {
      !isMobileView && setIsMobileView(true);
    }

    const windowResizeHandler = () => {
      if (window?.innerWidth <= 600) {
        !isMobileView && setIsMobileView(true);
      } else {
        isMobileView && setIsMobileView(false);
      }
    };
    window.addEventListener("resize", windowResizeHandler);

    return () => {
      window.removeEventListener("resize", windowResizeHandler);
    };
  }, []);
  return (
    <>
      <Layout className="layout">
        {" "}
        <SearchBase
          index={process.env.REACT_APP_APPBASE_APP_NAME}
          credentials={process.env.REACT_APP_APPBASE_APP_CREDENTIALS}
          url={process.env.REACT_APP_APPBASE_URL}
          appbaseConfig={{
            recordAnalytics: true,
            enableQueryRules: true,
            userId: "jon@appbase.io",
            customEvents: {
              platform: "ios",
              device: "iphoneX",
            },
          }}
        >
          <div>
            <h2>
              React Searchbox Demo{" "}
              <span style={{ fontSize: "1rem" }}>
                <a
                  href="https://docs.appbase.io/docs/reactivesearch/react-searchbox/apireference/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  API reference
                </a>
              </span>
            </h2>

            <Row gutter="24" justify="center">
              <Col xs={20} sm={20} md={24} lg={16} xl={16}>
                <SearchBox
                  clearFiltersOnQueryChange
                  id="search-component"
                  dataField={[
                    {
                      field: "title",
                      weight: 5,
                    },
                    {
                      field: "title.search",
                      weight: 1,
                    },

                    {
                      field: "NER.keyword",
                      weight: 3,
                    },
                    {
                      field: "ingredients.keyword",
                      weight: 2,
                    },
                  ]}
                  title="Search"
                  placeholder="Yummy Pasta..."
                  autosuggest={false}
                  enablePopularSuggestions={false}
                  enableRecentSearches={false}
                  size={10}
                  debounce={100}
                  fuzziness="AUTO"
                  showClear
                  showVoiceSearch
                  URLParams
                  className="result-search-box"
                  showDistinctSuggestions
                  iconPosition="left"
                  style={{ paddingBottom: 10 }}
                  queryFormat="and"
                ></SearchBox>
              </Col>
            </Row>
            <Row justify="center" gutter={(24, 24)} className="filter-row">
              <Col
                xs={20}
                sm={20}
                md={24}
                lg={6}
                xl={6}
                style={
                  isMobileView &&
                  showFilterOptions && {
                    position: "fixed",
                    zIndex: 2,
                    background: "rgba(255 ,255, 255 , .9)",
                    height: "100vh",
                    top: 0,
                    width: "100vw",
                    maxWidth: "100%",
                    paddingTop: "20px",
                    overflowY: "scroll",
                  }
                }
              >
                {isMobileView && !showFilterOptions && (
                  <Button
                    onClick={() => setShowFilterOptions(!showFilterOptions)}
                  >
                    {showFilterOptions ? "Hide" : "Show"} Filters
                  </Button>
                )}
                <SearchBox
                  queryFormat="and"
                  clearFiltersOnQueryChange
                  customQuery={() => ({
                    timeout: "1s",
                  })}
                  className={
                    !showFilterOptions && isMobileView && "isIngredientHidden"
                  }
                  autosuggest={false}
                  aggregationSize={20}
                  id="filter-search-component"
                  dataField={[
                    {
                      field: "NER.keyword",
                      weight: 4,
                    },
                  ]}
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Ingredient Filter</span>
                      {window.innerWidth < 600 && (
                        <Button
                          onClick={() =>
                            setShowFilterOptions(!showFilterOptions)
                          }
                        >
                          {showFilterOptions ? "Hide" : "Show"} Filters
                        </Button>
                      )}
                    </div>
                  }
                  placeholder="Try searching : 'salt' or 'sugar'"
                  autosuggest={false}
                  debounce={100}
                  fuzziness="AUTO"
                  showClear
                  URLParams
                  iconPosition="left"
                  style={{ paddingBottom: 10 }}
                  enablePredictiveSuggestions={true}
                />

                <SearchComponent
                  id="ingredient-filter"
                  onValueChange={function (value) {
                    console.log("value", value);
                  }}
                  type="term"
                  queryFormat="and"
                  highlight
                  aggregationSize={30}
                  dataField="NER.keyword"
                  subscribeTo={["aggregationData", "requestStatus", "value"]}
                  // URLParams
                  react={{
                    and: ["search-component", "filter-search-component"],
                  }}
                  value={[]}
                  render={({
                    aggregationData,
                    loading,
                    value,
                    setValue,
                    query,
                  }) => {
                    // console.log("value", value, aggregationData);
                    const responseValue = value
                      ? value.map((item) => item.toLowerCase())
                      : [];
                    // const sortedFilters = [...responseValue];
                    // console.log("This is the query", aggregationData);
                    // aggregationData?.data?.map((item) => {
                    //   if (!responseValue.includes(item._key.toLowerCase())) {
                    //     sortedFilters.push(item._key);
                    //   }
                    // });
                    const sortedFilters = [];
                    aggregationData?.data?.map((item) => {
                      if (!responseValue.includes(item._key.toLowerCase())) {
                        sortedFilters.push(item);
                      } else {
                        sortedFilters.unshift(item);
                      }
                    });

                    return (
                      <div
                        className={
                          !showFilterOptions && isMobileView
                            ? " filter-container isIngredientHidden"
                            : "filter-container"
                        }
                      >
                        {loading ? (
                          <Row
                            justify="center"
                            align="middle"
                            gutter={[24, 24]}
                            style={{ width: "100%", height: "200px" }}
                          >
                            {" "}
                            <Col span={24}>
                              <Spin spinning={loading} size="large"></Spin>
                            </Col>
                          </Row>
                        ) : (
                          <>
                            {sortedFilters
                              .slice(
                                0,
                                Math.max(
                                  7,
                                  showAllFilters || isMobileView
                                    ? sortedFilters.length
                                    : 7
                                )
                              )
                              .map((item) => {
                                const isChecked = value
                                  ? responseValue.includes(item._key)
                                  : false;
                                return (
                                  <div className="list-item" key={item}>
                                    <CheckableTag
                                      checked={isChecked}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gridGap: "6px",
                                        textTransform: "capitalize",
                                        fontSize: "13px",
                                        ...(!isChecked && {
                                          backgroundColor: "rgb(204, 204, 204)",
                                        }),
                                      }}
                                      onChange={(checked) => {
                                        let values = value || [];
                                        if (!checked) {
                                          values = [
                                            ...values.filter(
                                              (valueItem) =>
                                                valueItem != item._key
                                            ),
                                          ];
                                        } else {
                                          values.push(item._key);
                                        }
                                        // Set filter value and trigger custom query
                                        setValue(values, {
                                          triggerDefaultQuery: false,
                                          triggerCustomQuery: true,
                                          stateChanges: true,
                                        });
                                      }}
                                    >
                                      {isChecked ? (
                                        <MinusCircleTwoTone />
                                      ) : (
                                        <PlusCircleTwoTone />
                                      )}{" "}
                                      {`${item._key} ( ${item._doc_count} )`}
                                    </CheckableTag>
                                  </div>
                                );
                              })}

                            {!isMobileView && (
                              <Col span={24}>
                                <Button
                                  type="primary"
                                  onClick={() =>
                                    setShowAllFilters(!showAllFilters)
                                  }
                                  style={{ fontWeight: "bold" }}
                                >
                                  Show {showAllFilters ? "Less" : "More"}
                                </Button>
                              </Col>
                            )}
                          </>
                        )}
                      </div>
                    );
                  }}
                />
              </Col>

              <Col xs={20} sm={24} md={24} lg={18} xl={18}>
                <SearchComponent
                  id="result-component"
                  URLParams
                  highlight
                  defaultQuery={() => {
                    return { track_total_hits: true };
                  }}
                  dataField={["title"]}
                  aggregationField="title.keyword"
                  size={10}
                  aggregationSize={10}
                  react={{
                    and: ["search-component", "ingredient-filter"],
                  }}
                  subscribeTo={["aggregationData", "requestStatus"]}
                  preserveResults={true}
                  onQueryChange={() => {
                    // console.log("QUERY GOT CHANGED");
                  }}
                >
                  {({
                    results,
                    loading,
                    size,
                    setValue,
                    setFrom,
                    aggregationData,
                  }) => {
                    // console.log("aggregationData", aggregationData);
                    console.log("results", results);
                    // if (
                    //   (concatData.length == 0 || !!pageChange) &&
                    //   results.data.length > 0
                    // ) {
                    //   console.log("PREV", concatData, results.data);
                    //   setConcatData([...concatData, ...results.data]);
                    //   console.log("state changed");
                    //   pageChange = false;
                    // }
                    const sourceChoices = [results, aggregationData];

                    // use
                    // choiceIndex = 0 --------> Results
                    // choiceIndex = 1 --------> Aggregations
                    const choiceIndex = 0;
                    let scrollToTop =
                      sourceChoices[choiceIndex].data.length <= 10;
                    console.log(
                      "scrollToTop",
                      scrollToTop,
                      sourceChoices[choiceIndex].data.length
                    );
                    return (
                      <>
                        {" "}
                        {!sourceChoices[choiceIndex].data.length ? (
                          <Empty
                            description={
                              <span>
                                {loading
                                  ? "Fetching Data!"
                                  : "No Results Found!"}
                              </span>
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
                                {results.time}
                              </strong>{" "}
                              ms
                            </p>
                          </Col>
                        )}
                        <InfiniteScrollContainer
                          callNextPage={() => {
                            if (
                              Math.floor(results.numberOfResults / size) >=
                              currentPage
                            ) {
                              currentPage++;
                              pageChange = true;
                              setFrom((currentPage + 1) * size);
                            }
                          }}
                          loading={loading}
                          scrollToTop={scrollToTop}
                        >
                          <div className="result-list-container">
                            <Spin spinning={loading}>
                              <Row
                                gutter={[16, 16]}
                                justify="start"
                                wrap
                                justify="flex-start"
                                className="result-row"
                              >
                                {sourceChoices[choiceIndex].data?.map(
                                  (itemRaw) => {
                                    const item =
                                      choiceIndex == 1
                                        ? itemRaw.hits.hits[0]._source
                                        : itemRaw;

                                    return (
                                      <CardItem
                                        item={item}
                                        setfullRecipe={setfullRecipe}
                                      />
                                    );
                                  }
                                )}
                              </Row>
                            </Spin>{" "}
                          </div>
                        </InfiniteScrollContainer>
                      </>
                    );
                  }}
                </SearchComponent>
              </Col>
            </Row>
          </div>
        </SearchBase>
      </Layout>
      <RecipeFullView
        isModalVisible={fullRecipe.isModalVisible}
        recipeItem={fullRecipe.recipeItem}
        onClose={() => setfullRecipe({ isModalVisible: false, recipeItem: {} })}
      />
    </>
  );
};
