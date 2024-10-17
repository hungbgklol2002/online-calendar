import * as React from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from "@mui/icons-material/People";
import GroupsIcon from "@mui/icons-material/Groups";
import { Link } from "react-router-dom";

function SideMenu() {
  return (
    <>
      <Toolbar />
      <List>
        <ListItem key={"home"} disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Sự kiện của tôi"}
              primaryTypographyProps={{ style: { fontWeight: "bold" } }}
            />
          </ListItemButton>
        </ListItem>
        
      </List>
      <Divider />
    </>
  );
}

export default SideMenu;
