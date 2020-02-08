import React from "react";
import { TableChart, Stack, StackItem } from "nr1";

// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction

export default class Lab1NerdletNerdlet extends React.Component {
  constructor(props) {
    super(props);
    this.accountId = 2586072;
    this.state = {
      appId: null,
      appName: null
    };
    console.debug("Nerdlet constructor", this); //eslint-disable-line
  }

  render() {
    const { appId, appName } = this.state;
    const nrql = `SELECT count(*) as 'transactions', apdex(duration) as 'apdex', percentile(duration, 99, 90, 70) FROM Transaction facet appName, appId limit 25`;
    //return the JSX we're rendering
    return (
      <Stack
        verticalType={Stack.VERTICAL_TYPE.FILL}
        directionType={Stack.DIRECTION_TYPE.VERTICAL}
        gapType={Stack.GAP_TYPE.EXTRA_LOOSE}
      >
        <StackItem>
          <TableChart
            query={nrql}
            accountId={this.accountId}
            className="chart"
          />
        </StackItem>
      </Stack>
    );
  }
}
