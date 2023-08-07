import { Crypto } from "../Types";
import { useEffect, useState } from "react";

export type AppProps = {
  crypto: Crypto;
  updateOwned: (crypto: Crypto, amount: number) => void;
};

export default function CryptoSummary({
  crypto,
  updateOwned,
}: AppProps): JSX.Element {
  useEffect(() => {
    console.log(crypto.name, amount, crypto.current_price * amount);
  });

  const [amount, setAmount] = useState<number>(0);
  return (
    <div>
      <span key={crypto.id}>{crypto.name + " $" + crypto.current_price}</span>
      <input
        style={{ margin: 10 }}
        value={amount}
        type="number"
        onChange={(e) => {
          setAmount(parseFloat(e.target.value));
          //set the parent state by calling a function passed in as a prop
          updateOwned(crypto, parseFloat(e.target.value));
        }}
      ></input>
      <p>
        {isNaN(amount)
          ? "$0.00"
          : "$" +
            (crypto.current_price * amount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
      </p>
    </div>
  );
}
