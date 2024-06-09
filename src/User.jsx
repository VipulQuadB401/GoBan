import React from "react";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  ListItemSecondaryAction,
  makeStyles,
} from "@material-ui/core";
import { Person, Add } from "@material-ui/icons";

// Define custom styles using Material-UI's makeStyles
const useStyles = makeStyles((theme) => ({
  listItem: {
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      cursor: "pointer",
    },
  },
  selected: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

export function User({ name, onSelect, selected }) {
  const classes = useStyles(); // Use the defined styles

  return (
    <ListItem
      className={`${classes.listItem} ${selected ? classes.selected : ""}`}
      onClick={onSelect}
    >
      <ListItemAvatar>
        <Avatar>
          <Person />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={name} />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="add" onClick={onSelect}>
          <Add />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
