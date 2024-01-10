'use client'
import Themed from "@/components/Themed";
import FadeWrapper from '@/components/FadeWrapper'

import * as React from 'react';
import useDarkMode from "@/utils/hooks/useDarkmode";
import { Body, CustomDrawer, DrawerHeader, CustomAppbar } from "./CustomAppbar";

import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CategoryIcon from '@mui/icons-material/Category';
import Box from "@mui/material/Box";

import useClientLogin from "@/utils/hooks/useClientLogin";
import ProgressBar from "@/components/Progress/ProgressBar";
import Notifications from "../Notifications/Notifications";
import Fade from "@mui/material/Fade";


export default function NavWrapper({ children }) {
    const [open, setOpen] = React.useState(false)
    const onDrawerOpen = () => setOpen(true)
    const onDrawerClose = () => setOpen(false)
    const { darkmode, toggleDarkMode } = useDarkMode()

    const optionLists = [
        [
            {
                name: "dashboard",
                link: "/",
                icon: <DashboardIcon />
            },
            {
                name: "account",
                link: "/profile",
                icon: <ManageAccountsIcon />
            },
        ],
        [
            {
                name: "manage products",
                link: "/product",
                icon: <CategoryIcon />
            }
        ]
    ]

    const [valid, location, notValid] = useClientLogin()

    return (
        <Themed darkmode={darkmode}>

            {!notValid && location !== "/signin" && <>
                <Fade in={valid} mountOnEnter unmountOnExit>
                    <div>
                        <Box sx={{ zIndex: 3000, width: 1, height: 10, position: "absolute" }}>
                            <ProgressBar id={1} />
                        </Box>
                        <CustomAppbar open={open} onOpen={onDrawerClose} onClose={onDrawerOpen} />
                        <CustomDrawer optionLists={optionLists} toggleDarkMode={toggleDarkMode} open={open} />
                    </div>
                </Fade>

                <Body open={open} className="test-body">
                    <DrawerHeader />
                    <Box id="pageContainer" sx={{ px: 4, }}>
                        <FadeWrapper key={location}>
                            {children}
                        </FadeWrapper>
                    </Box>
                </Body>
            </>}

            {(!valid && location === "/signin") &&
                <FadeWrapper>
                    {children}
                </FadeWrapper>}

            {!valid && location !== "/signin" &&
                <Box sx={(theme) => ({ backgroundColor: theme.palette.background.default, zIndex: 10000, width: 1, height: 1 })}>

                </Box>
            }

            <Notifications />
        </Themed>
    )
}