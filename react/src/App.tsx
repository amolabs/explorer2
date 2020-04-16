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
import {Redirect, Route, Switch} from "react-router-dom"
import {push, replace} from "connected-react-router"
import Transactions from "./pages/Transactions"
import {RootState} from "./reducer"
import {RESET_CURRENT_HEIGHT} from "./reducer/blocks"
import Blocks from "./pages/Blocks"
import Inspect from "./pages/Inspect"
import Validators from "./pages/Validators"

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
  'transactions',
  'validators',
]

const supportedNetworks = [
  'amo-cherryblossom-01',
  'amo-testnet-200330'
]

const networkMap = supportedNetworks.reduce((acc: { [k: string]: boolean }, v) => {
  acc[v] = true
  return acc
}, {})

function App() {
  const classes = useStyles()
  const dispatch = useDispatch()

  const path = useSelector<RootState, string>(state => state.router.location.pathname)
  const chainId = useSelector<RootState, string>(state => state.blockchain.chainId)

  const [tab, setTab] = useState<number>(0)

  const isDesktop = useMediaQuery('(min-width: 1280px)')

  const updateBlockchain = () => {
    if (path.split('/')[1] === chainId) {
      dispatch({
        type: UPDATE_BLOCKCHAIN
      })
    }
  }

  useEffect(() => {
    updateBlockchain()
    const handler = setInterval(() => {
      updateBlockchain()
    }, 3000)

    return () => clearInterval(handler)
  }, [dispatch, chainId])

  const handleTabChange = (event: any, newValue: any) => {
    dispatch(push(`/${chainId}${urls[newValue]}`))
    setTab(newValue)
  }

  useEffect(() => {
    const [, chainId, page] = path.split("/")

    if (!networkMap[chainId]) {
      dispatch(replace(`/${supportedNetworks[0]}`))
      return
    }

    let i = 0
    const slashPage = "/" + page
    for (; i < urls.length; i++) {
      if (urls[i] === slashPage) {
        break
      }
    }

    if (i === urls.length) {
      dispatch(replace(`/${supportedNetworks[0]}`))
      return
    }

    dispatch(setNetwork(chainId))
    dispatch({
      type: RESET_CURRENT_HEIGHT
    })

    setTab(i)
  }, [path, dispatch])

  const onChangeNetwork = (e: React.ChangeEvent<{ name?: string; value: unknown }>,) => {
    const newPath = `/${path.split('/').slice(2).join('/')}`
    dispatch(push(`/${e.target.value}${newPath}`))
  }

  return (
    <div>
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
      <div style={{
        marginTop: '124px'
      }}>
        <div style={{
          padding: '24px',
          height: '300px',
          display: 'flex'
        }}>
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
                  <Route path={`/:chainId`} exact={true} component={Blockchain}/>
                  <Route path={`/:chainId/`} exact={true} component={Blockchain}/>
                  <Route path={`/:chainId/transactions`} component={Transactions}/>
                  <Route path={`/:chainId/blocks`} component={Blocks}/>
                  <Route path={`/:chainId/inspect`} component={Inspect}/>
                  <Route path={`/:chainId/validators`} component={Validators}/>
                  <Route path="/">
                    <Redirect to="/amo-cherryblossom-01/"/>
                  </Route>
                </Switch>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  )
}

export default App
