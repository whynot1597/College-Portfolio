import React from "react";
import { ListItem } from "@material-ui/core";

function ListItemLink(props) {
  return (
    <ListItem
      button
      component="a"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  );
}

export default ListItemLink;
