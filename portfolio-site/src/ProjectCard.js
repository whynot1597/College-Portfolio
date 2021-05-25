import {
  Card,
  CardActionArea,
  CardHeader,
  Typography,
} from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import React from "react";

function ProjectCard(props) {
  const classes = props.classes;

  const handleButton = (e) => {
    window.open(props.url, "_blank");
  };

  return (
    <Card className={classes.card}>
      <CardActionArea onClick={handleButton}>
        <CardHeader avatar={<FolderIcon />} title={props.name} />
        <Typography className={classes.title} color="textPrimary" gutterBottom>
          placeholder
        </Typography>
      </CardActionArea>
    </Card>
  );
}

export default ProjectCard;
