import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Block from "./Block"
import Transaction from "./Transaction"

const Inspect = () => {

  return (
    <Switch>
      <Route path="/:chainId/inspect/block/:height" component={Block}/>
      <Route path="/:chainId/inspect/tx/:hash" component={Transaction}/>
    </Switch>
  )
}

export default Inspect
