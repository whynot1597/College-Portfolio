import { Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import projectDetails from "./project-details";

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
          folders.forEach((folder) => {
            const project = projectDetails.filter(
              (proj) => proj.name === folder.name
            );
            folder.description = project[0].description;
          });
          console.log(folders);
          setProjects(folders);
          setIsLoaded(true);
        })
        .catch((error) => console.error(error));
    }
  });

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item key="header" xs={12}>
          <Typography variant="h4">My Github Repositories</Typography>
        </Grid>
        {projects.map((project) => {
          return (
            <Grid item key={project.name}>
              <ProjectCard
                name={project.name}
                url={project["_links"].html}
                description={project.description}
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
