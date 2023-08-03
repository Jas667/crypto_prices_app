import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios"; //instead of using fetch
import { Crypto } from "./Types";
import CryptoSummary from "./components/CryptoSummary";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js"; //importing types from chart.js so they can be set on necessary states
import moment from "moment"; //for formatting dates

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [cryptos, setCryptos] = useState<Crypto[] | null>(null);
  const [selected, setSelected] = useState<Crypto | null>();
  const [data, setData] = useState<ChartData<"line">>();
  const [options, setOptions] = useState<ChartOptions<"line">>({
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  });

  useEffect(() => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en";
    axios.get(url).then((response) => {
      setCryptos(response.data);
    });
  }, []);
  return (
    <>
      <div>
        <select
          onChange={(e) => {
            const c = cryptos?.find((x) => x.id === e.target.value);
            setSelected(c);
            //request and update data state
            axios
              .get(
                `https://api.coingecko.com/api/v3/coins/${c?.id}/market_chart?vs_currency=usd&days=30&interval=daily`
              )
              .then((response) => {
                setData({
                  labels: response.data.prices.map((price: number[]) => {
                    return moment.unix(price[0] / 1000).format("MM-DD");
                  }),
                  datasets: [
                    {
                      label: c?.name,
                      data: response.data.prices.map((price: number[]) => {
                        return price[1];
                      }),
                      borderColor: "rgb(255, 99, 132)",
                      backgroundColor: "rgba(255, 99, 132, 0.5)",
                    },
                  ],
                });
              });
          }}
          defaultValue="default"
        >
          <option value="default">Choose an option</option>
          {cryptos
            ? cryptos.map((crypto) => {
                return (
                  <option key={crypto.id} value={crypto.id}>
                    {crypto.name}
                  </option>
                );
              })
            : null}
        </select>
      </div>
      {selected ? <CryptoSummary crypto={selected} /> : null}
      {data ? (
        <div style={{ width: 600 }}>
          <Line data={data} options={options} />
        </div>
      ) : null}
    </>
  );
}

export default App;
