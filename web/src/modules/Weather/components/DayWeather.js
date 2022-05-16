import React from 'react';
import { Card, Divider, Icon, Image } from 'semantic-ui-react';
import sun_image from 'assets/sun.png';
import sunny_image from 'assets/sunny.png';
import rain_image from 'assets/rain.png';
import { useTranslation } from "react-i18next";
import { observer } from 'mobx-react';
import { favoriteForecastStore } from '../stores';

// List of conditions from API:

// storm - tempestade
// snow - neve
// hail - granizo
// rain - chuva
// fog - neblina
// clear_day - dia limpo
// clear_night - noite limpa
// cloud - nublado
// cloudly_day - nublado de dia
// cloudly_night - nublado de noite
// none_day - erro ao obter mas está de dia
// none_night - erro ao obter mas está de noite

const sun = ['clear_day', 'clear_night', 'none_day', 'none_night']
const sunny = ['fog', 'cloud', 'cloudly_day', 'cloudly_night']
// const rain = ['storm', 'hail', 'rain']

const TodayWeatherCard = observer(props => {
  const { t } = useTranslation();
  const { forecast } = props;
  let icon, day, weekDay;

  if (sun.includes(forecast.results?.condition_slug)) {
    icon = sun_image;
  } else if (sunny.includes(forecast.results?.condition_slug)) {
    icon = sunny_image;
  } else {
    icon = rain_image;
  }

  day = forecast.results?.date.split('/')[0];
  weekDay = forecast.results?.forecast?.[0]?.weekday

  return (
    <Card centered fluid raised>

      <Image
        size='small'
        src={icon}
        centered
        wrapped
      />

      <Card.Content>

        <Card.Header>
          <div style={{ textAlign: 'center' }}>

            {forecast.city}

            <br />

            {t("Today")} ({day}), {weekDay}

            <br />

            <Icon name="thermometer half" /> {forecast.results?.temp} °C

          </div>
        </Card.Header>

        <Card.Description>

          {t("Now is")}: {forecast.results?.currently} | {forecast.results?.description}
          <Divider />
          {t("Humidity")}: {forecast.results?.humidity} %
          <Divider />
          {t("Wind Speed")}: {forecast.results?.wind_speedy}
          <Divider />
          {t("Min")}: {forecast.results?.forecast?.[0]?.min} °C | {t("Max")}: {forecast.results?.forecast?.[0]?.max} °C
          <Divider />

        </Card.Description>

      </Card.Content>
    </Card>
  )
});

const DayWeatherCard = observer(props => {
  const { t } = useTranslation();
  const { forecast, favorite } = props;
  let icon;

  if (sun.includes(forecast?.condition)) {
    icon = sun_image;
  } else if (sunny.includes(forecast?.condition)) {
    icon = sunny_image;
  } else {
    icon = rain_image;
  }

  const handleCreateFavorite = (id) => {
    favoriteForecastStore.create(id);
  }

  const handleRemoveFavorite = (id) => {
    favoriteForecastStore.remove(id);
  }

  return (
    <Card>

      <Image
        size='mini'
        src={icon}
        centered
        wrapped
      />


      <Card.Content>

        {
          favorite
            ?
            <a onClick={() => handleRemoveFavorite(forecast.id)} >
              <Icon link name="delete" color='red' />
            </a>
            :
            <a onClick={() => handleCreateFavorite(forecast.id)} >
              <Icon name="star" />
            </a>
        }

        <Card.Header>
          <div style={{ textAlign: 'center' }}>

            {forecast.date} - {forecast.weekday}

            <br />

            <Icon name="thermometer half" />
            {t("Min")}: {forecast?.min} °C | {t("Max")}: {forecast?.max} °C

          </div>
        </Card.Header>

      </Card.Content>
    </Card>
  )
});

export default TodayWeatherCard;
export { DayWeatherCard };