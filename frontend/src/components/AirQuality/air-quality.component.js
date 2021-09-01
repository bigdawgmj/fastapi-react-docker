import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    cards: {
        margin: theme.spacing(1),
        backgroundColor: 'white',
    },
}));

const AirQuality = (props) => {
    const classes = useStyles();
    // const handleMinuteChange = (evt) => {
    //     setMinutes(evt.target.value);
    // };

    return (
        <div>
            <Card className={classes.cards}>
                <CardHeader title={'Air Quality'} />
                <CardContent>
                    {/* {{ props }} */}
                    {/* <Paper className={classes.paper}>
                        <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
                            <VictoryAxis
                                label={'Week'}
                                tickValues={range(22, this.state.totalWeeks + 1)}
                                fixLabelOverlap={true}
                                style={{ axisLabel: { fontSize: 12, padding: 30 } }}
                            />
                            <VictoryAxis
                                dependentAxis
                                label={'Total Minutes'}
                                style={{ axisLabel: { fontSize: 12, padding: 40 } }}
                                fixLabelOverlap={true}
                            />
                            <VictoryBar
                                data={this.state.sumData}
                                x="week"
                                y="minutes"
                                labels={({ datum }) => `minutes: ${datum.minutes}`}
                                labelComponent={<VictoryTooltip dy={0} centerOffset={{ x: 25 }} />}
                            />
                        </VictoryChart>
                    </Paper> */}
                </CardContent>
            </Card>
        </div>
    );
};

export default AirQuality;
