import React from 'react';
import { useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ScatterController,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-moment';
import PriceBar from './PriceBar';

ChartJS.register(
  ScatterController,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const PriceHistory = ({ priceData })=> {
  const num_bins = 50;

  console.log(priceData)

  const sold_data_N = [
    ...priceData.sold.new
    .filter(item => new Date(item.date) >= new Date('2024-01-01')) // Keep dates >= 2024
    .map(item => ({ x: item.date, y: item.price })),
  ];

  const sold_data_U = [
    ...priceData.sold.used
    .filter(item => new Date(item.date) >= new Date('2024-01-01'))
    .map(item => ({ x: item.date, y: item.price })),
  ];

  const allPrices = [
    ...sold_data_N.map((point) => point.y),
    ...sold_data_U.map((point) => point.y),
  ];

  console.log(priceData.stats.sold_max_N)
  console.log(priceData.stats.sold_max_U)

  const maxPrice = Math.ceil((Math.max(...[priceData.stats.sold_max_N, priceData.stats.sold_max_U]))/10)*10


  // CHANGE THIS TO EXISTING PRICES
  let price_bins = {};
  for (let price in allPrices) {
    const bin = Math.floor((price / maxPrice) * num_bins);
    if (price_bins[bin]) {
      price_bins[bin] += 1;
    } else {
      price_bins[bin] = 1;
    }
  }

  console.log(price_bins);

  const data = {
    datasets: [
      {
        label: 'New Items',
        data: sold_data_N,
        backgroundColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 3,
        pointHoverRadius: 6,
      },
      {
        label: 'Used Items',
        data: sold_data_U,
        backgroundColor: 'rgba(54, 162, 235, 1)',
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
      },
      y: {
        beginAtZero: true,
        max: maxPrice,
        ticks: {
          // Format tick labels as dollar amounts
          callback: (value) => `$${value.toFixed(2)}`,
        },
      },
    },
    plugins: {
        tooltip: {
          callbacks: {
            // Customize the title of the tooltip (top part)
            title: (tooltipItems) => {
              const item = tooltipItems[0];
              return `Date: ${item.label}`; // Display the date
            },
            // Customize the main label of the tooltip
            label: (tooltipItem) => {
              const { x, y } = tooltipItem.raw; // Raw data point
              return `Price: $${Number(y).toFixed(2)}`; // Display the price
            },
          },
        },
      },
  };
  

  return (
    <div className="price-history">
      <img className="minifig-picture" src={priceData.data.image_url} alt={`photo of ${priceData.data.name}`} />
      <div className="price-data">
        <div style={{ width: '800px', margin: '0 auto' }}>
          <Scatter data={data} options={options} />
        </div>
        <PriceBar priceData={priceData} maxPrice={maxPrice}/>
      </div>
    </div>
  );
}

export default PriceHistory;

// https://www.bricklink.com/v2/catalog/catalogitem.page?M=sw0599&name=Santa%20Darth%20Vader&category=%5BStar%20Wars%5D%5BStar%20Wars%20Other%5D#T=S&O={%22iconly%22:0}
// https://www.bricklink.com/v2/catalog/catalogitem.page?M=sw0981&name=Darth%20Vader%20(Bacta%20Tank)&category=%5BStar%20Wars%5D%5BStar%20Wars%20Rogue%20One%5D#T=S&O={%22iconly%22:0}