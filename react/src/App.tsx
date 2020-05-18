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
import Dashboard from "./pages/Dashboard"
import {Search} from "@material-ui/icons"
import {Redirect, Route, RouteProps, Switch} from "react-router-dom"
import {push, replace} from "connected-react-router"
import Transactions from "./pages/Transactions"
import {RootState} from "./reducer"
import Blocks from "./pages/Blocks"
import Inspect from "./pages/Inspect"
import Validators from "./pages/Validators"
import Footer from "./component/Footer"
import Governance from "./pages/Governance"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  mr2: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 2,
  },
  searchForm: {
    flexDirection: 'row',
    flexGrow: 1
  }
}))

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: "#fafafa",
      dark: "#fafafa"
    }
  },
})

const routers: RouteProps[] = [
  {
    path: '/:chainId',
    exact: true,
    component: Dashboard
  },
  {
    path: '/:chainId/inspect',
    component: Inspect
  },
  {
    path: '/:chainId/blocks',
    component: Blocks
  },
  {
    path: '/:chainId/transactions',
    component: Transactions
  },
  {
    path: '/:chainId/validators',
    component: Validators
  },
  {
    path: '/:chainId/governance',
    component: Governance
  }
]

const urls = routers.map((r) => (r.path as string).replace(/\/:chainId\/?/, '/'))

const tabList = [
  'dashboard',
  'inspect',
  'blocks',
  'transactions',
  'validators',
  'governance'
]

const supportedNetworks = [
  'amo-cherryblossom-01',
  'amo-testnet-200330'
]

const networkMap = new Set(supportedNetworks)

const ExplorerBar = () => {
  const classes = useStyles()
  const [tab, setTab] = useState<number>(0)
  const [searchText, setSearchText] = useState('')
  const isDesktop = useMediaQuery('(min-width: 1280px)')

  const dispatch = useDispatch()
  const chainId = useSelector<RootState, string>(state => state.blockchain.chainId)
  const path = useSelector<RootState, string>(state => state.router.location.pathname)

  const handleTabChange = (event: any, newValue: any) => {
    dispatch(push(`/${chainId}${urls[newValue]}`))
    setTab(newValue)
  }

  useEffect(() => {
    const [, newChainId, page = ''] = path.split("/")

    if (!networkMap.has(newChainId)) {
      dispatch(replace(`/${supportedNetworks[0]}`))
      return
    }

    if (chainId !== newChainId) {
      dispatch(setNetwork(newChainId))
    }

    const slashPage = "/" + page
    for (let i = 0; i < urls.length; i += 1) {
      if (urls[i] === slashPage) {
        setTab(i)
        return
      }
    }

    dispatch(replace(`/${supportedNetworks[0]}`))
  }, [path, dispatch, chainId])

  const onChangeNetwork = (e: React.ChangeEvent<{ name?: string; value: unknown }>,) => {
    window.open(`/${e.target.value}`)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value.trim())
  }

  const onSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      const length = searchText.length
      if (length === 40) {
        dispatch(replace(`/${chainId}/inspect/account/${searchText}`))
      } else if (length === 64) {
        dispatch(replace(`/${chainId}/inspect/tx/${searchText}`))
      } else {
        if(/^([0-9]+)$/.test(searchText)) {
          dispatch(replace(`/${chainId}/inspect/block/${searchText}`))
        } else {
          dispatch(replace(`/${chainId}/inspect/404`))
        }
      }
    }
  }

  return (
    <AppBar position="fixed">
      <Toolbar>
        <img src={require('./assets/amo_white.png')} alt="logo" style={{
          height: '36px',
          marginRight: '12px'
        }}/>
        <Hidden only={['xs', 'sm']}>
          <Typography variant={"h6"} className={classes.title}>
            AMO Blockchain Explorer
          </Typography>
        </Hidden>
        <ThemeProvider theme={darkTheme}>
          <FormControl className={classes.searchForm}>
            <InputLabel id="network-select-label">
              Network
            </InputLabel>
            <Select
              value={chainId}
              labelId="network-select-label"
              className={classes.mr2}
              onChange={onChangeNetwork}
              style={{
                width: '40%'
              }}
            >
              {supportedNetworks.map((v, i) => (
                <MenuItem value={v} key={i}>{v}</MenuItem>
              ))}
            </Select>
            <TextField
              value={searchText}
              onChange={onChange}
              onKeyUp={onSearch}
              style={{
                width: '60%'
              }}
              placeholder={"Block height, Account, Transaction hash"}
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
  )
}

function App() {
  const dispatch = useDispatch()

  const path = useSelector<RootState, string>(state => state.router.location.pathname)
  const chainId = useSelector<RootState, string>(state => state.blockchain.chainId)

  useEffect(() => {
    const updateBlockchain = () => {
      const matchedChainId = path.split('/')[1]
      if (matchedChainId === chainId || matchedChainId === '') {
        dispatch({type: UPDATE_BLOCKCHAIN})
      }
    }

    updateBlockchain()
    const handler = setInterval(() => {
      updateBlockchain()
    }, 3000)

    return () => clearInterval(handler)
  }, [dispatch, path, chainId])

  return (
    <div>
      <ExplorerBar/>
      <div
        style={{
          marginTop: '124px'
        }}
      >
        <div
          style={{
            padding: '24px',
            display: 'flex',
            minHeight: 'calc(100vh - 254px)'
          }}
        >
          <Grid
            container
            justify="center"
          >
            <Grid
              item
              className="fixed-width"
            >
              <Grid
                container
                spacing={2}
              >
                <Switch>
                  {routers.map((r, i) => (
                    <Route key={i} {...r} />
                  ))}
                  <Route path="/" exact={true}>
                    <Redirect to={`/${supportedNetworks[0]}`}/>
                  </Route>
                </Switch>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <Footer/>
      </div>
    </div>
  )
}

export default App
