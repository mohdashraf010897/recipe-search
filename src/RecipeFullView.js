import Modal from "antd/lib/modal/Modal";
import React, { useState, useEffect } from "react";
import IngredientIcon from "./assets/images/ingredients.svg";
import { LinkOutlined } from "@ant-design/icons";
import CookingIcon from "./assets/images/cooking.svg";

const RecipeFullView = ({
  isModalVisible = false,
  recipeItem = {},
  onClose = () => console.log("Provide an onclose handler"),
}) => {
  return (
    Object.keys(recipeItem).length > 0 && (
      <Modal
        style={{ top: 20, textAlign: "left" }}
        title={recipeItem.title}
        visible={isModalVisible}
        onCancel={onClose}
        footer={
          <span>
            <LinkOutlined />{" "}
            <a href={"https://" + recipeItem.link} target="_blank">
              {recipeItem.link.split(".")[1]}
            </a>
          </span>
        }
      >
        <div>
          <h3>Ingredients</h3>
          <ul
            style={{
              padding: 0,
              listStyle: "none",
              display: "grid",
              gridTemplateColumns: "1fr",
            }}
          >
            {recipeItem.ingredients.map((item) => {
              return (
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gridGap: "7px",
                    margin: " 4px 1px",
                  }}
                >
                  <img src={IngredientIcon} height="15px" />
                  {item[0].toUpperCase() + item.substring(1)}
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h3>Cook this Way!</h3>
          <ul
            style={{
              padding: 0,
              listStyle: "none",
              display: "grid",
              gridTemplateColumns: "1fr",
            }}
          >
            {recipeItem.directions.map((item) => {
              return (
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gridGap: "7px",
                    margin: " 4px 1px",
                  }}
                >
                  <img src={CookingIcon} height="20px" />
                  {item[0].toUpperCase() + item.substring(1)}
                </li>
              );
            })}
          </ul>
        </div>
      </Modal>
    )
  );
};

export default RecipeFullView;