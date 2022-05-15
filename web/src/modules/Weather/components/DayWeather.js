import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import sun from 'assets/sun.png';
import sunny from 'assets/sunny.png';
import rain from 'assets/rain.png';



const DayWeatherCard = props => {
  const { day, weekDay, weather, description } = props;
  let icon;

  if (weather === 'sun') {
    icon = sun;
  } else if (weather === 'sunny') {
    icon = sunny;
  } else {
    icon = rain;
  }

  return (
    <Card>
      <Card.Content>
        <Image
          floated='left'
          size='small'
          src={icon} />
        <Card.Header>{day} {weekDay}</Card.Header>
        <Card.Description>{description}</Card.Description>
      </Card.Content>
    </Card>
  )
}

export default DayWeatherCard;