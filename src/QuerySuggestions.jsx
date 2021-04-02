import React, { Component } from "react";
import { SearchContext } from "@appbaseio/react-searchbox";
import { Row, Tag } from "antd";
class QuerySuggestions extends Component {
  static contextType = SearchContext;

  getStaticRecipeJsx = (optionsArr) => {
    return optionsArr.map((option, index) => (
      <>
        <Tag
          style={{ cursor: "pointer" }}
          onClick={() => {
            this.context._components["search-component"].setValue(
              option.value,
              {
                triggerCustomQuery: true,
              }
            );
          }}
          color={option.tagColor}
        >
          {option.value}
        </Tag>
        &nbsp;
      </>
    ));
  };
  render() {
    console.log(this.context._components["search-component"]);
    const STATIC_RECIPE_SUGGESTIONS = [
      { value: "Pizza", tagColor: "magenta" },
      { value: "Curry", tagColor: "red" },
      { value: "Low Carb", tagColor: "volcano" },
      { value: "Pasta", tagColor: "orange" },
      { value: "Fried", tagColor: "gold" },
      { value: "Diabetic", tagColor: "lime" },
      { value: "Veg", tagColor: "green" },
      { value: "Healthy", tagColor: "geekblue" },
      { value: "Saute", tagColor: "cyan" },
    ];
    return (
      <Row style={{ rowGap: "10px" }}>
        Try: &nbsp;{this.getStaticRecipeJsx(STATIC_RECIPE_SUGGESTIONS)}
      </Row>
    );
  }
}

export default QuerySuggestions;
