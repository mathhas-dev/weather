import React, { useEffect } from 'react'
import { observer } from 'mobx-react';
import TodayWeatherCard, { DayWeatherCard } from 'modules/Weather/components/DayWeather';
import { CardGroup, Step, } from 'semantic-ui-react';
import { favoriteForecastStore, weatherStore } from '../stores';
import { useTranslation } from "react-i18next";

const FavoriteForecast = observer(props => {
    const favorites = favoriteForecastStore.list;
    const { t } = useTranslation();

    return (
        <>
            <h3>{t("Favorites")}</h3>
            <Step.Group>
                {favorites?.map(item =>
                    <Step>
                        <Step.Content>
                            <DayWeatherCard forecast={item.forecast} favorite />
                        </Step.Content>
                    </Step>
                )}
            </Step.Group>
        </>
    );
});

const Weather = observer(props => {
    const { t } = useTranslation();
    const data = weatherStore.data;
    const forecast = data?.forecast;
    const has_favorites = favoriteForecastStore.list.length;

    useEffect(() => {
        weatherStore.getByGEOIP();
        favoriteForecastStore.reload();
    }, [])

    return (
        <>
            {
                has_favorites
                    ?
                    <FavoriteForecast />
                    :
                    null
            }

            <h2>{t("Today")}</h2>
            <TodayWeatherCard forecast={data} />

            <h3>{t("Forecast")}</h3>
            <CardGroup centered>
                {forecast?.map(item =>
                    <DayWeatherCard forecast={item} />)}
            </CardGroup>
        </>

    );
});

export default Weather;