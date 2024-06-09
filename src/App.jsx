import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { User } from "./User";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  List,
  CircularProgress,
  Paper,
  makeStyles,
  ThemeProvider,
  createTheme,
  Button,
  Switch,
  FormControlLabel,
  ListItem,
  ListItemText,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    display: "flex",
    justifyContent: "space-between",
  },
  container: {
    marginTop: theme.spacing(4),
  },
  searchBar: {
    marginBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
  },
  userText: {
    fontFamily: "NEPHILIM, cursive",
    fontStyle: "italic",
    marginTop: theme.spacing(2),
    textAlign: "center",
    fontSize: "2rem",
  },
  filters: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: theme.spacing(2),
  },
  hiddenList: {
    display: "none",
  },
}));

const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
    text: {
      primary: "#000000",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      paper: "#424242",
    },
    text: {
      primary: "#ffffff",
    },
  },
});

function App() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [previousUsers, setPreviousUsers] = useState([]);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showPrevious, setShowPrevious] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const listRef = useRef();

  useEffect(() => {
    setIsLoading(true);

    const controller = new AbortController();
    fetch("https://jsonplaceholder.typicode.com/users", {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(setUsers)
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listRef.current && !listRef.current.contains(event.target)) {
        setShowCurrent(false);
        setShowPrevious(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectUser = (user) => {
    setPreviousUsers((prev) => {
      if (currentUser) {
        return [...prev, currentUser];
      }
      return prev;
    });
    setCurrentUser(user);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      const match = users.find(
        (user) => user.name.toLowerCase() === searchQuery.toLowerCase()
      );
      if (match) {
        handleSelectUser(match);
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar className={classes.appBar}>
            <Typography
              variant="h6"
              style={{ fontSize: window.innerWidth < 400 ? "1rem" : "1.2rem" }}
            >
              GoBananas User List
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
              }
              label="Dark Mode"
            />
          </Toolbar>
        </AppBar>
        <Container className={classes.container}>
          <TextField
            label="Search Users"
            variant="outlined"
            fullWidth
            className={classes.searchBar}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleInputKeyPress}
          />
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Paper className={classes.paper}>
              <List ref={listRef}>
                {filteredUsers.map((user) => (
                  <User
                    key={user.id}
                    name={user.name}
                    onSelect={() => handleSelectUser(user)}
                    selected={currentUser && currentUser.id === user.id}
                  />
                ))}
              </List>
            </Paper>
          )}
          {currentUser && (
            <Typography variant="h6" className={classes.userText}>
              The current Head of user is {currentUser.name}
            </Typography>
          )}
          <div className={classes.filters}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (currentUser) setShowCurrent((prev) => !prev);
              }}
            >
              Current
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (previousUsers.length > 0) setShowPrevious((prev) => !prev);
              }}
            >
              Previous
            </Button>
          </div>
          <List ref={listRef}>
            {showCurrent && currentUser && (
              <ListItem>
                <ListItemText primary={currentUser.name} />
              </ListItem>
            )}
            {showPrevious &&
              previousUsers.map((user) => (
                <ListItem key={user.id}>
                  <ListItemText primary={user.name} />
                </ListItem>
              ))}
          </List>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
