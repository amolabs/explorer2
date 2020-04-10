import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Block from "./Block"

const Inspect = () => {

  return (
    <Switch>
      <Route path="/:chainId/inspect/block/:height" component={Block}/>
    </Switch>
  )
}

export default Inspect
