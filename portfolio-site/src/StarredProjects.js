import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";

function StarredProjects(props) {
  const classes = props.classes;
  const [isLoaded, setIsLoaded] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!isLoaded) {
      fetch(
        "https://api.github.com/repos/whynot1597/College-Portfolio/contents",
        {
          method: "GET",
          headers: new Headers({
            Accept: "application/vnd.github.cloak-preview",
          }),
        }
      )
        .then((res) => res.json())
        .then((response) => {
          const folders = response.filter((content) => content.type === "dir");
          setProjects(folders);
          setIsLoaded(true);
        })
        .catch((error) => console.error(error));
    }
  });

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        {projects.map((project) => {
          return (
            <Grid item key={project.name}>
              <ProjectCard
                name={project.name}
                url={project["_links"].html}
                {...props}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default StarredProjects;
