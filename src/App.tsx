import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios"; //instead of using fetch
import CryptoSummary from "./components/CryptoSummary";
import { Crypto } from "./Types";

function App() {
  const [cryptos, setCryptos] = useState<Crypto[] | null>();
  useEffect(() => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en";
    axios.get(url).then((response) => {
      console.log(response.data);
      setCryptos(response.data);
    });
  }, []);
  return (
    <>
      <div>
        {cryptos
          ? cryptos.map((crypto) => {
              return <CryptoSummary crypto={crypto} />;
            })
          : null}
      </div>
    </>
  );
}

export default App;
