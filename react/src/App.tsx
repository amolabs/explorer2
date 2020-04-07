import React, {useEffect, useState} from "react"
import {
  AppBar,
  createMuiTheme,
  FormControl,
  Grid,
  Hidden,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery
} from "@material-ui/core"
import {makeStyles, ThemeProvider} from "@material-ui/core/styles"
import {useDispatch, useSelector} from "react-redux"
import {UPDATE_BLOCKCHAIN} from "./reducer/blockchain"
import Blockchain from "./pages/Blockchain"
import {Search} from "@material-ui/icons"
import {Route, Switch} from "react-router-dom"
import {replace} from "connected-react-router"
import Transactions from "./pages/Transactions"
import {RootState} from "./reducer"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  mr2: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  searchForm: {
    flexDirection: 'row'
  }
}))

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark'
  }
})

const routers = {
  '/': {
    exact: true
  },
  '/inspect': {
    exact: true
  },
  '/blocks': {},
  '/transactions': {},
  '/validators': {},
  '/governance': {},
  '/storages': {},
  '/parcels': {}
}

const urls = Object.keys(routers)

function App() {
  const classes = useStyles()
  const [tab, setTab] = useState<number>(0)
  const dispatch = useDispatch()

  const path = useSelector<RootState, string>(state => state.router.location.pathname)

  const isDesktop = useMediaQuery('(min-width: 1280px)')

  useEffect(() => {
    dispatch({
      type: UPDATE_BLOCKCHAIN
    })
    const handler = setInterval(() => {
      dispatch({
        type: UPDATE_BLOCKCHAIN
      })
    }, 5000)

    return () => clearInterval(handler)
  }, [dispatch])

  const handleTabChange = (event: any, newValue: any) => {
    dispatch(replace(urls[newValue]))
    setTab(newValue)
  }

  useEffect(() => {
    let i = 0
    for (; i < urls.length; i++) {
      if (urls[i] === path) {
        break
      }
    }

    setTab(i)
  }, [path])

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <img src={require('./assets/amo_white.png')} alt="logo" style={{
            height: '36px',
            marginRight: '12px'
          }}/>
          <Hidden only={['xs']}>
            <Typography variant={"h6"} className={classes.title}>
              AMO Blockchain Explorer
            </Typography>
          </Hidden>
          <ThemeProvider theme={darkTheme}>
            <FormControl className={classes.searchForm}>
              <InputLabel id="network-select-label">
                Network
              </InputLabel>
              <Select value={"amo-cherryblossom-01"} labelId="network-select-label" className={classes.mr2}>
                <MenuItem value="amo-cherryblossom-01">mainnet</MenuItem>
              </Select>
              <TextField
                placeholder={"block, account, transaction"}
                label="Search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search/>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
          </ThemeProvider>
        </Toolbar>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          aria-label="main tabs"
          variant={isDesktop ? 'standard' : 'scrollable'}
          scrollButtons="on"
          centered={isDesktop}
        >
          <Tab label="blockchain"/>
          <Tab label="inspect"/>
          <Tab label="blocks"/>
          <Tab label="transaction" onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.preventDefault()
          }}/>
          <Tab label="validators"/>
          <Tab label="governance"/>
          <Tab label="storages"/>
          <Tab label="parcels"/>
        </Tabs>
      </AppBar>
      <div style={{
        paddingLeft: '1rem',
        paddingRight: '1rem'
      }}>
        <div style={{
          padding: '24px',
          height: '300px',
          display: 'flex'
        }}>
          <Grid
            style={{
              width: 'calc(100% + 30px)',
              margin: '0 -15px'
            }}
            container
            spacing={2}
          >
            <Switch>
              <Route path="/" exact={true}>
                <Blockchain/>
              </Route>
              <Route path="/transactions">
                <Transactions/>
              </Route>
            </Switch>
          </Grid>
        </div>
      </div>
    </div>
  )
}

export default App
