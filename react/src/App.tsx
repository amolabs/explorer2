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
import {setNetwork, UPDATE_BLOCKCHAIN} from "./reducer/blockchain"
import Blockchain from "./pages/Blockchain"
import {Search} from "@material-ui/icons"
import {Redirect, Route, Switch, useRouteMatch} from "react-router-dom"
import {push} from "connected-react-router"
import Transactions from "./pages/Transactions"
import {RootState} from "./reducer"
import {RESET_CURRENT_HEIGHT} from "./reducer/blocks"
import Blocks from "./pages/Blocks"

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

const tabList = [
  'blockchain',
  'inspect',
  'blocks',
  'transaction',
  'validators',
  'governance',
  'storages',
  'parcels'
]

const supportedNetworks = [
  'amo-cherryblossom-01',
  'amo-testnet-200330'
]

const SwitchRender = () => {

  const {url} = useRouteMatch()

  return (
    <>
      <Route path={`${url}/`} exact={true}>
        <Blockchain/>
      </Route>
      <Route path={`${url}/transactions`}>
        <Transactions/>
      </Route>
      <Route path={`${url}/blocks`}>
        <Blocks/>
      </Route>
    </>
  )
}

function App() {
  const classes = useStyles()
  const [tab, setTab] = useState<number>(0)
  const dispatch = useDispatch()

  const path = useSelector<RootState, string>(state => state.router.location.pathname)
  const chainId = useSelector<RootState, string>(state => state.blockchain.chainId)

  const isDesktop = useMediaQuery('(min-width: 1280px)')

  useEffect(() => {
    dispatch({
      type: UPDATE_BLOCKCHAIN
    })
    const handler = setInterval(() => {
      dispatch({
        type: UPDATE_BLOCKCHAIN
      })
    }, 3000)

    return () => clearInterval(handler)
  }, [dispatch, chainId])

  const handleTabChange = (event: any, newValue: any) => {
    dispatch(push(`/${chainId}${urls[newValue]}`))
    setTab(newValue)
  }

  useEffect(() => {
    const [_, chainId, page] = path.split("/")
    let i = 0
    for (; i < urls.length; i++) {
      if (urls[i] === "/" + page) {
        break
      }
    }

    dispatch(setNetwork(chainId))
    dispatch({
      type: RESET_CURRENT_HEIGHT
    })

    setTab(i)
  }, [path])

  const onChangeNetwork = (e: React.ChangeEvent<{ name?: string; value: unknown }>,) => {
    const target = "/" + path.split("/")[2]
    dispatch(push(`/${e.target.value}${target}`))
  }

  return (
    <div>
      <AppBar position="fixed">
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
              <Select value={chainId} labelId="network-select-label" className={classes.mr2}
                      onChange={onChangeNetwork}>
                {
                  supportedNetworks.map((v, i) => (
                    <MenuItem value={v} key={i}>{v}</MenuItem>
                  ))
                }
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
          {tabList.map((t, i) => (
            <Tab
              key={i}
              label={t}
            />
          ))}
        </Tabs>
      </AppBar>
      <div style={{
        paddingLeft: '1rem',
        paddingRight: '1rem',
        marginTop: '112px'
      }}>
        <div style={{
          padding: '24px',
          height: '300px',
          display: 'flex'
        }}>
          <Grid
            container
            spacing={2}
          >
            <Switch>
              <Route path="/:networkId">
                <Switch>
                  <SwitchRender/>
                </Switch>
              </Route>
              <Route path="/">
                <Redirect to="/amo-cherryblossom-01/"/>
              </Route>
            </Switch>
          </Grid>
        </div>
      </div>
    </div>
  )
}

export default App
