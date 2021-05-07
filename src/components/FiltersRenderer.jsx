import React from "react";
import { Button, Col, Row, Spin, Tag } from "antd";
import { PlusCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons";
import "./../styles/filtersRenderer.css";
const { CheckableTag } = Tag;

const FiltersRenderer = ({
  showFilterOptions,
  showAllFilters,
  isMobileView,
  loading,
  value,
  selectedFilters,
  sortedFilters,
  setValue,
  setShowAllFilters,
}) => {
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
          className="spinner-container"
        >
          {" "}
          <Col span={24}>
            <Spin spinning={loading} size="large"></Spin>
          </Col>
        </Row>
      ) : (
        <>
          {sortedFilters //showing only 7 or less filters by default; based on users'choice and device width
            .slice(
              0,
              Math.max(
                7,
                showAllFilters || isMobileView ? sortedFilters.length : 7
              )
            )
            .map((item) => {
              const isChecked = value
                ? selectedFilters.includes(item._key.toLowerCase())
                : false;
              return (
                <div className="list-item" key={item._key}>
                  <CheckableTag
                    checked={isChecked}
                    onChange={(checked) => {
                      let values = value || [];
                      if (!checked) {
                        values = [
                          ...values.filter(
                            (valueItem) => valueItem != item._key
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
                    {isChecked ? <MinusCircleTwoTone /> : <PlusCircleTwoTone />}{" "}
                    {`${item._key} ( ${new Intl.NumberFormat("en-US", {
                      maximumSignificantDigits: 3,
                    }).format(item._doc_count)} )`}
                  </CheckableTag>
                </div>
              );
            })}

          {/* //for desktop only */}
          {!isMobileView && (
            <Col span={24}>
              <Button
                type="primary"
                onClick={() => setShowAllFilters(!showAllFilters)}
              >
                Show {showAllFilters ? "Less" : "More"}
              </Button>
            </Col>
          )}
        </>
      )}
    </div>
  );
};

export default FiltersRenderer;
