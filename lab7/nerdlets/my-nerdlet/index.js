import React from "react";
import { Grid, GridItem, AutoSizer } from "nr1";
import {
  NrqlQuery,
  Spinner,
  LineChart,
  BlockText,
  PlatformStateContext,
  NerdletStateContext,
  EntityByGuidQuery
} from "nr1";
import { generateForecastData } from "./utils";

export default class MyNerdlet extends React.Component {
  render() {
    return (
      <PlatformStateContext.Consumer>
        {platformUrlState => (
          <NerdletStateContext.Consumer>
            {nerdletUrlState => (
              <EntityByGuidQuery entityGuid={nerdletUrlState.entityGuid}>
                {({ data, loading, error }) => {
                  console.debug("EntityByGuidQuery", [loading, data, error]); //eslint-disable-line
                  if (loading) {
                    return <Spinner fillContainer />;
                  }
                  if (error) {
                    return <BlockText>{error.message}</BlockText>;
                  }
                  const entity = data.entities[0];
                  const { accountId } = entity;
                  const { duration } = platformUrlState.timeRange;
                  const durationInMinutes = duration / 1000 / 60;

                  //we're going to replace this soon
                  console.debug("We're ready for our NrqlQuery", [
                    entity,
                    accountId,
                    duration,
                    durationInMinutes
                  ]);
                  return (
                    <NrqlQuery
                      accountId={accountId}
                      query={`SELECT uniqueCount(session) FROM PageView WHERE appName = '${entity.name.replace(
                        "'",
                        "\\'"
                      )}' TIMESERIES SINCE ${durationInMinutes} MINUTES AGO COMPARE WITH ${durationInMinutes *
                        2} MINUTES AGO`}
                    >
                      {({ loading, data, error }) => {
                        console.debug("NrqlQuery", [loading, data, error]); //eslint-disable-line
                        if (loading) {
                          return <Spinner fillContainer />;
                        }
                        if (error) {
                          return <BlockText>{error.message}</BlockText>;
                        }
                        data.push(generateForecastData(data[0]));
                        return <LineChart data={data} className="chart" />;
                      }}
                    </NrqlQuery>
                  );
                }}
              </EntityByGuidQuery>
            )}
          </NerdletStateContext.Consumer>
        )}
      </PlatformStateContext.Consumer>
    );
  }
}
