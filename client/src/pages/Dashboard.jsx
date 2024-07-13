import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    useEffect(()=>{
      const UrlParams = new URLSearchParams(location.search);
      const tabFromUrl = UrlParams.get("tab");
      console.log(tabFromUrl);
    }, [location.search]);
  return (
    <div>Dashboard</div>
  )
}
