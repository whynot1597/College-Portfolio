import {
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Link } from "@material-ui/icons";
import FolderIcon from "@material-ui/icons/Folder";
import React from "react";

function ProjectCard(props) {
  const classes = props.classes;

  const handleButton = (e) => {
    window.open(props.url, "_blank");
  };

  return (
    <CardActionArea onClick={handleButton}>
      <Card className={classes.card}>
        <CardHeader
          avatar={<FolderIcon />}
          title={props.name}
          titleTypographyProps={{ variant: "h4" }}
        />
        <Typography
          className={classes.cardText}
          color="textPrimary"
          gutterBottom
          variant="body2"
        >
          {props.description}
        </Typography>
        <CardActions>
          <IconButton aria-label="open repo">
            <Link />
          </IconButton>
        </CardActions>
      </Card>
    </CardActionArea>
  );
}

export default ProjectCard;
