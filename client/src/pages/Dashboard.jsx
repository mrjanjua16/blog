import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashProfile from '../components/DashProfile';
import DashSidebar from '../components/DashSidebar';

export default function Dashboard() {
    const location = useLocation();
    const [tab, setTab] = useState('');

    useEffect(() => {
        const UrlParams = new URLSearchParams(location.search);
        const tabFromUrl = UrlParams.get("tab");

        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="md:w-56">
                <DashSidebar />
            </div>
            {tab === "profile" && <DashProfile />}
        </div>
    );
}
