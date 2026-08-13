import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import DashboardLayout from './views/DashboardLayout';
import AuthWrapper from './components/AuthWrapper';

import OwnersList from './views/OwnersList';
import PropertiesList from './views/PropertiesList';
import AllPropertiesList from './views/AllPropertiesList';
import PendingApprovals from './views/PendingApprovals';
import MasterDataConfig from './views/MasterDataConfig';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<Login />} />

            <Route element={<AuthWrapper />}>
                <Route path="/admin/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="owners" replace />} />
                    <Route path="owners" element={<OwnersList />} />
                    <Route path="owners/:ownerId/properties" element={<PropertiesList />} />
                    <Route path="properties" element={<AllPropertiesList />} />
                    <Route path="pending" element={<PendingApprovals />} />
                    <Route path="master-data" element={<MasterDataConfig />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
