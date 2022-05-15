import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import sun from 'assets/sun.png';
import sunny from 'assets/sunny.png';
import rain from 'assets/rain.png';



const DayWeatherCard = props => {
  return (
    <Card>
      <Card.Content>
        <Image
          floated='left'
          size='small'
          src={rain} />
        <Card.Header>Segunda-Feira, 16 de Maio de 2022</Card.Header>
        <Card.Description>Sol!</Card.Description>
      </Card.Content>
    </Card>
  )
}

export default DayWeatherCard;