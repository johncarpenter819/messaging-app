import { useEffect, useState } from "react";
import { ping } from "../api/api";

export default function Test() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    ping().then((data) => setMessage(data.message));
  }, []);

  return <div>Server Says: {message}</div>;
}
