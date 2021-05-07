import React, { Component } from "react";
import { SearchContext } from "@appbaseio/react-searchbox";
import { Row, Tag } from "antd";
import { STATIC_RECIPE_SUGGESTIONS } from "./../helper/constans";
class QuerySuggestions extends Component {
  static contextType = SearchContext;

  getStaticRecipeJsx = (optionsArr) => {
    return optionsArr.map((option) => (
      <>
        <Tag
          style={{ cursor: "pointer" }}
          onClick={() => {
            this.context._components["search-component"].setValue(
              option.value,
              { triggerCustomQuery: true }
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
    return (
      <Row style={{ rowGap: "10px" }}>
        Try: &nbsp;{this.getStaticRecipeJsx(STATIC_RECIPE_SUGGESTIONS)}
      </Row>
    );
  }
}

export default QuerySuggestions;
