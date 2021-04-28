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
import Layout from "antd/lib/layout/layout";
import Meta from "antd/lib/card/Meta";
import { PlusCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons";
import IngredientIcon from "./assets/images/ingredients.svg";
import OvenGloveIcon from "./assets/images/oven-glove.svg";
import RecipeFullView from "./components/RecipeFullView";
import InfiniteScrollContainer from "./components/InfiniteScrollContainer";
import QuerySuggestions from "./components/QuerySuggestions";

const getHostname = (url) => {
  let urlLocal = url,
    tempProtocol = "";
  // use URL constructor and return hostname
  if (urlLocal.indexOf("://") == -1) {
    tempProtocol = "https://";
    urlLocal = tempProtocol + urlLocal;
  }
  console.log("url", url);
  return new URL(urlLocal).hostname.split(".")[1];
};

const PromotedCardItem = ({ item }) => {
  return (
    <Col span={24}>
      {" "}
      <Card
        style={{
          width: "100%",
          border: " 1px solid #cf1421",
          borderRadius: "5px",
        }}
        bodyStyle={{ padding: "10px 10px 0" }}
        title={null}
      >
        {" "}
        <Row
          justify="space-between"
          align="middle"
          style={{ height: "40px" }}
          wrap={false}
        >
          <h3
            style={{
              height: "auto",
              whiteSpace: "pre-wrap",
              marginBottom: "0px",
              lineHeight: "15px",
              fontSize: "14px",
              color: "#ff7f7f",
              display: "flex",
              alignItems: "center",
              gridGap: "7px",
              textAlign: "left",
            }}
          >
            <img
              style={{
                transform: "rotate(-25deg)",
                height: "30px",
                position: "relative",
                top: "1px",
              }}
              src="https://img.icons8.com/emoji/48/000000/speaker-medium-volume.png"
            />
            <span>{item.title.trim().replace(/[()]/g, "")}</span>
          </h3>
          <Tag
            color="red"
            style={{
              fontSize: "14px",
              textTransform: "uppercase",
              fontWeight: "600",
              borderRadius: "40px",

              padding: "2px 8px",
              lineHeight: "unset",
            }}
          >
            Promoted
          </Tag>
        </Row>
        <Row
          justify="space-between"
          align="bottom"
          style={{ padding: "10px 0", textAlign: "left", lineHeight: "15px" }}
          wrap={false}
        >
          {" "}
          <span>
            Sponsored by :{" "}
            <Tooltip title="See Full Recipe!">
              {" "}
              <a href={item.link} target="_blank">
                {getHostname(item.link)}
              </a>{" "}
            </Tooltip>
          </span>
          <i> Powered by Query Rules</i>
        </Row>
      </Card>
    </Col>
  );
};

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
              __html: item.title.trim().replace(/[()]/g, ""),
            }}
          ></h3>
        </div>
      }
    >
      <Meta
        style={{
          textAlign: "left",
          height: 110,
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
              gridColumnGap: "5px",
              flexWrap: "wrap",
              gridRowGap: "4px",
              fontSize: ".75rem",
            }}
          >
            {item?.NER?.filter(
              (item) => item.replace(/[^A-Za-z']/g, "").length > 0
            ).map((item, idx, NER) => {
              return (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gridGap: "4px",
                  }}
                  key={idx * Math.random() * 100}
                >
                  {/* <img src={IngredientIcon} height="15px" /> */}
                  {item[0].toUpperCase() + item.substring(1)}
                  {idx !== NER.length - 1 ? "," : ""}
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
let currentPage = 0;
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
                  ]}
                  title="Search"
                  placeholder="Yummy Pasta..."
                  autosuggest={true}
                  enablePopularSuggestions={true}
                  enableRecentSearches={true}
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
                <QuerySuggestions />{" "}
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
                    !showFilterOptions && isMobileView
                      ? "isIngredientHidden"
                      : ""
                  }
                  autosuggest={false}
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
                  type="term"
                  queryFormat="and"
                  highlight
                  aggregationSize={30}
                  dataField="NER.keyword"
                  subscribeTo={["aggregationData", "requestStatus", "value"]}
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
                    const responseValue = value
                      ? value.map((item) => item.toLowerCase())
                      : [];
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
                                  ? responseValue.includes(
                                      item._key.toLowerCase()
                                    )
                                  : false;
                                return (
                                  <div className="list-item" key={item._key}>
                                    <CheckableTag
                                      checked={isChecked}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gridGap: "6px",
                                        textTransform: "capitalize",
                                        fontSize: "13px",
                                        borderColor: "#1b90ff",
                                        ...(!isChecked && {
                                          backgroundColor: "rgb(256,256,256)",
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
                                      {`${item._key} ( ${new Intl.NumberFormat(
                                        "en-US",
                                        {
                                          maximumSignificantDigits: 3,
                                        }
                                      ).format(item._doc_count)} )`}
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
                >
                  {(props) => {
                    const {
                      results,
                      loading,
                      size,
                      setValue,
                      setFrom,
                      aggregationData,
                      setAfter,
                      from,
                      after,
                    } = props;
                    console.log("props", results);
                    // console.log("aggregationData", aggregationData);
                    console.log("results", results);

                    const promotedData = !!results.promoted
                      ? [
                          ...results.promotedData.map((element) => {
                            return element.doc;
                          }),
                        ]
                      : [];
                    const sourceChoices = [results, aggregationData];

                    // use
                    // choiceIndex = 0 --------> Results
                    // choiceIndex = 1 --------> Aggregations
                    const choiceIndex = 1;

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
                            if (
                              Math.floor(results.numberOfResults / size) >=
                              currentPage
                            ) {
                              currentPage++;
                              choiceIndex == 0
                                ? setFrom(currentPage * size)
                                : setAfter?.(aggregationData.afterKey);
                            }
                          }}
                          loading={loading}
                          choiceIndex={choiceIndex}
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
                                {promotedData?.map((promotedItem) => (
                                  <PromotedCardItem
                                    key={promotedItem.id}
                                    item={promotedItem}
                                  />
                                ))}
                                {sourceChoices[choiceIndex].data?.map(
                                  (itemRaw) => {
                                    const item =
                                      choiceIndex == 1
                                        ? itemRaw.hits.hits[0]._source
                                        : itemRaw;
                                    return (
                                      <CardItem
                                        key={item.id * Math.random()}
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
