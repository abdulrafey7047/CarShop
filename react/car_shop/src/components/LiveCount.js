import React, { useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket';

//Material UI
import { Container } from '@mui/system';

//Charts.js
import { Chart as Chart} from 'chart.js/auto';
import { Line } from 'react-chartjs-2';


function LiveCount(){

    const [countData, setCountData] = useState({
        labels: [],
        datasets: [{
            label: 'Adds on our Website by Date',
            data: [],
            backgroundColor: ['blue']
        }]
    })

    // WebSocket Communication
    const url = `wss://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/ws/advertisment-count`
    const { readyState } = useWebSocket(url, {
    onOpen: (e) => {
      console.log("Connected!")
    },
    onClose: (e) => {
      console.log("Disconnected!")
    },
    onMessage: (e) => {
        const data = JSON.parse(e.data)
        const advertisments_by_date = data.payload.advertisments_by_date

        console.log(advertisments_by_date)

        const publish_dates = advertisments_by_date.map((element) => element['publish_date'])
        const advertisment_counts = advertisments_by_date.map((element) => element['total'])

        setCountData({
            labels: publish_dates,
            datasets: [{
                label: 'Adds on our Website by Date',
                data: advertisment_counts,
                backgroundColor: ['blue']
            }]
        })

    }
  });

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];


    return (

    <Container>
        <h1>Live Advertisment Count</h1>    
        <Line data={countData} />
    </Container>
    )
}

export default LiveCount
