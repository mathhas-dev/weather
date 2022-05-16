import React, { useEffect } from 'react'
import { observer } from 'mobx-react';
import TodayWeatherCard, { DayWeatherCard } from 'modules/Weather/components/DayWeather';
import { Card, CardGroup, Icon } from 'semantic-ui-react';
import { cityStore, favoriteForecastStore, weatherStore } from '../stores';
import { useTranslation } from "react-i18next";

const FavoriteForecast = observer(props => {
    const favorites = favoriteForecastStore.list;
    const { t } = useTranslation();

    return (
        <>
            <h3>{t("Favorites")}</h3>
            <Card.Group centered>
                {favorites?.map(item =>
                    <DayWeatherCard forecast={item.forecast} favorite />
                )}
            </Card.Group>
        </>
    );
});

const Cities = observer(props => {
    const { t } = useTranslation();
    const cities = cityStore.list;

    return (
        <CardGroup centered>
            <Card onClick={() => { cityStore.removeCity() }}>
                <Card.Content>
                    <Card.Header>
                        <Icon name='star' />
                        {t("My City")}
                    </Card.Header>
                </Card.Content>
            </Card>

            {cities?.map(city => {
                return (
                    <Card onClick={() => { cityStore.setCity(city.woeid) }}>
                        <Card.Content>
                            <Card.Header>
                                {city.name}
                            </Card.Header>
                        </Card.Content>
                    </Card>
                );
            })}
        </CardGroup>
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
        cityStore.reload();
    }, [])

    return (
        <>

            <Cities />
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