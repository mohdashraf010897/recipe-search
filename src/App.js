import React, { useState } from "react";
import {
  Row,
  Col,
  Spin,
  Tag,
  Empty,
  Card,
  Anchor,
  Divider,
  Tooltip,
  Button,
} from "antd";
import {
  SearchBox,
  SearchBase,
  SearchComponent,
} from "@appbaseio/react-searchbox";
import ReactPaginate from "react-paginate";

import "./styles.css";
import Layout from "antd/lib/layout/layout";
import Meta from "antd/lib/card/Meta";
import {
  LinkOutlined,
  PlusCircleTwoTone,
  MinusCircleTwoTone,
} from "@ant-design/icons";
import IngredientIcon from "./assets/images/ingredients.svg";
import OvenGloveIcon from "./assets/images/oven-glove.svg";
import RecipeFullView from "./RecipeFullView.js";
import InfiniteScrollContainer from "./InfiniteScrollContainer";

const { Link } = Anchor;
const { CheckableTag } = Tag;

export default () => {
  const [filterQuery, setFilterQuery] = useState("");

  const [fullRecipe, setfullRecipe] = useState({
    isModalVisible: false,
    recipeItem: {},
  });

  return (
    <>
      <Layout style={{ minHeight: "100vh", padding: "3rem" }}>
        {" "}
        <SearchBase
          index="recipes-demo"
          credentials="a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61"
          url="https://appbase-demo-ansible-abxiydt-arc.searchbase.io"
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

            <SearchBox
              id="search-component"
              dataField={[
                {
                  field: "title",
                  weight: 1,
                },
                {
                  field: "title.search",
                  weight: 2,
                },

                {
                  field: "NER.keyword",
                  weight: 4,
                },
                {
                  field: "ingredients.keyword",
                  weight: 2,
                },
              ]}
              title="Search"
              placeholder="Yummy Pasta..."
              autosuggest={false}
              size={10}
              debounce={100}
              queryFormat="or"
              fuzziness="AUTO"
              showClear
              showVoiceSearch
              URLParams
              className="custom-class"
              showDistinctSuggestions
              enablePopularSuggestions={false}
              enableRecentSearches={false}
              iconPosition="left"
              style={{ paddingBottom: 10 }}
            />
            <Row justify="center" gutter={(24, 24)}>
              <Col
                style={{ paddingTop: "2.5rem" }}
                xs={20}
                sm={20}
                md={24}
                lg={6}
                xl={6}
              >
                <SearchBox
                  customQuery={() => ({
                    timeout: "1s",
                  })}
                  autosuggest={false}
                  aggregationSize={20}
                  id="filter-search-component"
                  dataField={[
                    {
                      field: "NER.search",
                      weight: 4,
                    },
                    {
                      field: "ingredients.search",
                      weight: 4,
                    },
                    {
                      field: "NER.keyword",
                      weight: 4,
                    },
                    {
                      field: "ingredients.keyword",
                      weight: 4,
                    },
                    {
                      field: "NER.autosuggest",
                      weight: 3,
                    },
                    {
                      field: "ingredients.autosuggest",
                      weight: 3,
                    },
                  ]}
                  title="Ingredient Filter"
                  placeholder="Try searching : 'salt' or 'sugar'"
                  autosuggest={false}
                  debounce={100}
                  queryFormat="or"
                  fuzziness="AUTO"
                  showClear
                  URLParams
                  className="custom-class"
                  iconPosition="left"
                  style={{ paddingBottom: 10 }}
                  enablePredictiveSuggestions={true}
                />
                <SearchComponent
                  id="ingredient-filter"
                  type="term"
                  highlight
                  aggregationSize={30}
                  dataField="NER.keyword"
                  subscribeTo={["aggregationData", "requestStatus", "value"]}
                  URLParams
                  react={{
                    and: ["search-component", "filter-search-component"],
                  }}
                  // To initialize with default value
                  value={[]}
                  render={({ aggregationData, loading, value, setValue }) => {
                    console.log("value", value, aggregationData);
                    const responseValue = value || []; // full objects
                    const responseValueKeys = responseValue.map(
                      (item) => item._key
                    );
                    const sortedFilters = [...responseValue];

                    aggregationData?.data?.map((item) => {
                      if (
                        !responseValueKeys.includes(item._key.toLowerCase())
                      ) {
                        sortedFilters.push(item);
                      }
                    });

                    return (
                      <div className="filter-container">
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
                          sortedFilters.map((item) => {
                            const isChecked = value
                              ? responseValueKeys.includes(item._key)
                              : false;
                            return (
                              <div className="list-item" key={item._key}>
                                <CheckableTag
                                  key={item._key}
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
                                            valueItem._key != item._key
                                        ),
                                      ];
                                    } else {
                                      values.push(item);
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
                                  {item._key} ({item._doc_count})
                                </CheckableTag>
                              </div>
                            );
                          })
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
                  highlightField={["title.search"]}
                  defaultQuery={() => {
                    return { track_total_hits: true };
                  }}
                  dataField={["title"]}
                  aggregationField="title.keyword"
                  // size={10}

                  aggregationSize={10}
                  react={{
                    and: ["search-component", "ingredient-filter"],
                  }}
                  subscribeTo={["aggregationData", "value"]}
                >
                  {({
                    results,
                    loading,
                    size,
                    setValue,
                    setFrom,
                    aggregationData,
                    value,
                  }) => {
                    console.log(
                      "aggregationData",
                      aggregationData,
                      results,
                      size,
                      value
                    );

                    return (
                      <div className="result-list-container">
                        {/* {loading ? (
                      <div>Loading Results ...</div>
                    ) : ( */}
                        <Spin spinning={loading}>
                          <Row
                            gutter={[16, 16]}
                            justify="start"
                            wrap
                            justify="center"
                          >
                            {!results.data.length ? (
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
                              <Col span={24}>
                                {" "}
                                <p>
                                  {results.numberOfResults} results found in{" "}
                                  {results.time}ms
                                </p>
                              </Col>
                            )}
                            {/* <InfiniteScrollContainer
                              callNextPage={(pageNo) =>
                                setFrom((pageNo + 1) * size)
                              }
                            > */}{" "}
                            {results.data.map((item) => (
                              <Col flex="0 0 auto" key={item._id}>
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
                                          __html: item.title,
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
                                        {item.NER.map((item) => {
                                          return (
                                            <span
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gridGap: "4px",
                                              }}
                                            >
                                              <img
                                                src={IngredientIcon}
                                                height="15px"
                                              />
                                              {item[0].toUpperCase() +
                                                item.substring(1)}
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
                                            <LinkOutlined />{" "}
                                            <a
                                              href={"https://" + item.link}
                                              target="_blank"
                                            >
                                              {item.link.split(".")[1]}
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
                                              style={{ paddingLeft: "10px" }}
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
                            ))}
                            {/* </InfiniteScrollContainer> */}
                          </Row>
                        </Spin>
                        {/* )} */}
                        <ReactPaginate
                          pageCount={Math.floor(results.numberOfResults / size)}
                          onPageChange={({ selected }) =>
                            setFrom((selected + 1) * size)
                          }
                          previousLabel="previous"
                          nextLabel="next"
                          breakLabel="..."
                          breakClassName="break-me"
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          subContainerClassName="pages pagination"
                          breakLinkClassName="page-link"
                          containerClassName="pagination"
                          pageClassName="page-item"
                          pageLinkClassName="page-link"
                          previousClassName="page-item"
                          previousLinkClassName="page-link"
                          nextClassName="page-item"
                          nextLinkClassName="page-link"
                          activeClassName="active"
                        />
                      </div>
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
