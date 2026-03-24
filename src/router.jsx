import { createBrowserRouter } from "react-router";
import Home from "./Pages/Home.jsx";
import Root from "./Layouts/Root.jsx";
import AuthLayout from "./Layouts/AuthLayout.jsx";
import Login from "./AuthPages/Login.jsx";
import Register from "./AuthPages/Register.jsx";
import Forgot from "./AuthPages/Forgot.jsx";
import Code from "./AuthPages/Code.jsx";
import Reset from "./AuthPages/Reset.jsx";
import ErrorPage from "./Pages/ErrorComponent/ErrorPage.jsx";
import PrivateRoutes from "./Layouts/PrivateRoutes.jsx";
import Coverage from "./Pages/Coverage/Coverage.jsx";
import AboutUs from "./Pages/AboutUs/AboutUs.jsx";
import Pricing from "./Pages/Pricing/Pricing.jsx";
import DashboardLayout from "./Layouts/DashboardLayout.jsx";
import MyParcels from "./DashboardPages/MyParcels.jsx";
import AllParcels from "./DashboardPages/AllParcels.jsx";
import Payment from "./DashboardPages/Payment.jsx";
import History from "./DashboardPages/History/History.jsx";
import TrackingUpdates from "./DashboardPages/TrackParcel/TrackParcel.jsx";
import Rider from "./Pages/Rider/Rider.jsx";
import PendingRiders from "./Pages/Rider/PendingRiders.jsx";
import ActiveRiders from "./Pages/Rider/ActiveRiders.jsx";
import UserManagement from "./DashboardPages/UserManagement/UserManagement.jsx";
import AdminRoute from "./Layouts/AdminRoute.jsx";
import ConfirmRiders from "./DashboardPages/ConfirmRiders/ConfirmRiders.jsx";
import RiderRoute from "./Layouts/RiderRoute.jsx";
import PendingDeliveries from "./DashboardPages/PendingDeliveries/PendingDeliveries.jsx";
import CompleteDeliveries from "./DashboardPages/CompleteDeliveries/CompleteDeliveries.jsx";
import MyEarnings from "./DashboardPages/CompleteDeliveries/MyEarnings.jsx";
import DashboardHome from "./DashboardPages/DashboardHome/DashboardHome.jsx";



const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        children: [
            { index: true, Component: Home },
            {
                path: "*",
                Component: ErrorPage
            },
            {
                path: "rider",
                element: <PrivateRoutes>
                    <Rider></Rider>
                </PrivateRoutes>
            },
            {
                path: "about",
                Component: AboutUs
            },
            {
                path: "coverage",
                element: <PrivateRoutes>
                    <Coverage></Coverage>
                </PrivateRoutes>
            },
            {
                path: "pricing",
                element: <PrivateRoutes>
                    <Pricing></Pricing>
                </PrivateRoutes>
            },
        ],
    },
    {
        path: "*",
        Component: ErrorPage
    },
    {
        path: "/",
        Component: AuthLayout,
        children: [
            { path: "login", Component: Login },
            { path: "register", Component: Register },
            { path: "forgot", Component: Forgot },
            { path: "code", Component: Code },
            { path: "reset", Component: Reset },
        ],
    },
    {
        path : "/dashboard",
        element : <PrivateRoutes>
            <DashboardLayout></DashboardLayout>
        </PrivateRoutes>,
        children : [

            {index : true , Component : DashboardHome},

            { path : 'myParcels' , Component : MyParcels},
            { path : '*' , Component : ErrorPage},
            { path : 'payment/:id' , Component : Payment},
            { path : 'payments/history' , Component : History},
            { path : 'payments/track' , Component : TrackingUpdates},


            //admin

            { path : 'PendingRiders' , element : <AdminRoute><PendingRiders></PendingRiders></AdminRoute>},
            { path : 'ActiveRiders' , element : <AdminRoute><ActiveRiders></ActiveRiders></AdminRoute>},
            { path : 'UserManagement' , element : <AdminRoute><UserManagement></UserManagement></AdminRoute>},
            { path : 'ConfirmRiders' , element : <AdminRoute><ConfirmRiders></ConfirmRiders></AdminRoute>},
            { path : 'AllParcels' , element : <AdminRoute><AllParcels></AllParcels></AdminRoute>},

            //rider

            { path : 'PendingDeliveries' , element : <RiderRoute><PendingDeliveries></PendingDeliveries></RiderRoute>},
            { path : 'CompleteDeliveries' , element : <RiderRoute><CompleteDeliveries></CompleteDeliveries></RiderRoute>},
            { path : 'MyEarnings' , element : <RiderRoute><MyEarnings></MyEarnings></RiderRoute>},
        ]
    }
]);

export default router;