import React from 'react';

const MainMap = React.lazy(() => import('../pages/MainMap'));
const AdminPage = React.lazy(() => import('../pages/admin/AdminPage'));
const AdminEditPage = React.lazy(() => import('../pages/admin/AdminEditPage'));
const AdminLogin = React.lazy(() => import('../pages/admin/AdminLogin'));
const AdminMap = React.lazy(() => import('../pages/admin/AdminMap'));

export const userRoutes = [	
	{ path: '/', exact: true, name: 'MainMap', component : MainMap }
]

export const adminRoutes = [
	{ path: '/', exact: true, name: 'admin', component : AdminPage },
	{ path: '/edit/:id', exact: true, name: 'edit', component : AdminEditPage },
	{ path: '/login', exact: true, name: 'admin-login', component : AdminLogin },
	{ path: '/map', exact: true, name: 'admin-map', component : AdminMap },
]