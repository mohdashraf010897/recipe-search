import React, { useState, useEffect } from "react";
import {
  SearchBox,
  SearchBase,
  SearchComponent,
} from "@appbaseio/react-searchbox";
import { Row, Col, Button } from "antd";
import Layout from "antd/lib/layout/layout";
import QuerySuggestions from "./components/QuerySuggestions";
import FiltersRenderer from "./components/FiltersRenderer";
import ResultsRenderer from "./components/ResultsRenderer";
import RecipeFullView from "./components/RecipeFullView";
import "./App.css";

const App = () => {
  const [isMobileView, setIsMobileView] = useState(false); //state variable(boolean) depicting mobile view or otherwise
  const [fullRecipe, setfullRecipe] = useState({
    isModalVisible: false, //boolean for full-recipe modal visibility
    recipeItem: {}, // object holding current recipe opened in modal for full-recipe
  });
  const [showFilterOptions, setShowFilterOptions] = useState(false); //used in mobile view to show/ hide filter options (ingredient in this case)
  const [showAllFilters, setShowAllFilters] = useState(false); //used for displaying all available filters at once

  useEffect(() => {
    // using resize listener for applying mobile responsiveness programatically
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
              <span>
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
                {/* Main searchbox for searching recipes */}
                <SearchBox
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
                />
                {/* Recipe Suggestions Component */}
                <QuerySuggestions />
              </Col>
            </Row>
            <Row justify="center" gutter={(24, 24)} className="result-row">
              <Col
                xs={20}
                sm={20}
                md={24}
                lg={6}
                xl={6}
                className={`${
                  isMobileView && showFilterOptions
                    ? "show-ingredients-full-screen"
                    : ""
                }`}
              >
                {isMobileView && !showFilterOptions && (
                  <Button
                    onClick={() => setShowFilterOptions(!showFilterOptions)}
                  >
                    {showFilterOptions ? "Hide" : "Show"} Filters
                  </Button>
                )}

                {/* Searchbox for searching through ingredients */}
                <SearchBox
                  queryFormat="and"
                  className={`${
                    !showFilterOptions && isMobileView
                      ? "isIngredientHidden"
                      : ""
                  }`}
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
                      {isMobileView && (
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
                  autosuggest={true}
                  debounce={100}
                  fuzziness="AUTO"
                  showClear
                  URLParams
                  iconPosition="left"
                  style={{ paddingBottom: 10 }}
                  enablePredictiveSuggestions={true}
                />

                {/* Search component displaying ingredient filters facets */}
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
                  render={({ aggregationData, loading, value, setValue }) => {
                    //value prop gives us all the selected filters(ingredients)
                    const selectedFilters = value // storing selected filters' names in a separate variable
                      ? value.map((item) => item.toLowerCase())
                      : [];
                    const sortedFilters = []; // an array that would have sorted filters' list based on selected/ not-selected

                    //applying logic for having the selected filters always in front of array and rest following them
                    aggregationData?.data?.map((item) => {
                      if (!selectedFilters.includes(item._key.toLowerCase())) {
                        sortedFilters.push(item);
                      } else {
                        sortedFilters.unshift(item);
                      }
                    });

                    //Component for rendering Ingredient Filters
                    return (
                      <FiltersRenderer
                        showFilterOptions={showFilterOptions}
                        showAllFilters={showAllFilters}
                        isMobileView={isMobileView}
                        loading={loading}
                        value={value}
                        selectedFilters={selectedFilters}
                        sortedFilters={sortedFilters}
                        setValue={setValue}
                        setShowAllFilters={setShowAllFilters}
                      />
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
                  distinctField="title.keyword"
                  size={10}
                  aggregationSize={10}
                  react={{
                    and: ["search-component", "ingredient-filter"],
                  }}
                  preserveResults={true}
                >
                  {(props) => {
                    const { results, loading, size, setFrom } = props;

                    //getting promoted results separately from normal results
                    const promotedData = results?.promoted
                      ? [
                          ...results.promotedData.map((element) => {
                            return element.doc;
                          }),
                        ]
                      : [];

                    return (
                      //Component for rendering recipe results
                      <ResultsRenderer
                        results={results}
                        promotedData={promotedData}
                        loading={loading}
                        size={size}
                        setFrom={setFrom}
                        setfullRecipe={setfullRecipe}
                      />
                    );
                  }}
                </SearchComponent>
              </Col>
            </Row>
          </div>
        </SearchBase>
      </Layout>

      {/* Recipe full view modal */}
      <RecipeFullView
        isModalVisible={fullRecipe.isModalVisible}
        recipeItem={fullRecipe.recipeItem}
        onClose={() => setfullRecipe({ isModalVisible: false, recipeItem: {} })}
      />
    </>
  );
};

export default App;
