import React, { useEffect } from 'react'
import { observer } from 'mobx-react';
import TodayWeatherCard, { DayWeatherCard } from 'modules/Weather/components/DayWeather';
import { CardGroup } from 'semantic-ui-react';
import { weatherStore } from '../stores';

const Weather = observer(props => {
    const data = weatherStore.data;
    const forecast = data?.results?.forecast;

    useEffect(() => {
        weatherStore.getByGEOIP();
    }, [])

    return (
        <>
            <TodayWeatherCard forecast={data} />
            <CardGroup centered>
                {console.log(forecast)}
                {forecast?.map(item =>
                    <DayWeatherCard forecast={item} />)}
            </CardGroup>
        </>

    );
});

export default Weather;