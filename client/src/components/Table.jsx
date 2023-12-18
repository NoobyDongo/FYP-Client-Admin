'use client'
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
    ListItemIcon,
    MenuItem,
    Typography,
    lighten,
    ListItemText,
} from '@mui/material';
//MRT Imports
import {
    MRT_EditActionButtons,
    MaterialReactTable,
    useMaterialReactTable,
    MRT_GlobalFilterTextField,
    MRT_ToggleFiltersButton,
    MRT_TablePagination,
    MRT_ToggleDensePaddingButton,
    MRT_ToggleGlobalFilterButton,
    MRT_ToggleFullScreenButton,
    MRT_ShowHideColumnsButton,
} from 'material-react-table';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@emotion/react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect, useRef, useState } from 'react';

const Example = (props) => {
    const theme = useTheme()

    const { queryClient, useCreate, useGet, useUpdate, useDelete } = props
    const { setValidationErrors, validateRecord } = props
    const { columns } = props

    //call CREATE hook
    const { mutateAsync: createRecord, isPending: isCreatingUser } =
        useCreate();
    //call READ hook
    const {
        data: fetchedRecords = [],
        isError: isLoadingError,
        isFetching: isFetchingRecords,
        isLoading: isLoadingRecords,
    } = useGet();
    //call UPDATE hook
    const { mutateAsync: updateRecord, isPending: isUpdatingRecords } =
        useUpdate();
    //call DELETE hook
    const { mutateAsync: deleteRecord, isPending: isDeletingRecords } =
        useDelete();

    //CREATE action
    const handleCreate = async ({ values, table }) => {
        const newValidationErrors = validateRecord(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await createRecord(values);
        table.setCreatingRow(null); //exit creating mode
    };

    //UPDATE action
    const handleSave = async ({ values, table }) => {
        const newValidationErrors = validateRecord(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await updateRecord(values);
        table.setEditingRow(null); //exit editing mode
    };

    //DELETE action
    const openDeleteConfirmModal = (row) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteRecord(row.original.id);
        }
    };

    const table = useMaterialReactTable({
        columns,
        data: fetchedRecords,
        initialState: {
            columnVisibility: {
                firstName: false,
                lastName: false
            },
            showColumnFilters: false,
            showGlobalFilter: true,
            columnPinning: {
                right: ['startDate']
            }
        },
        enableColumnFilterModes: true,
        enableColumnOrdering: true,
        enableGrouping: true,
        enableColumnPinning: true,
        enableFacetedValues: true,
        enableRowActions: true,
        enableRowSelection: true,
        enableColumnResizing: true,
        enableBottomToolbar: true,
        enableStickyHeader: true,
        createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
        editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
        layoutMode: "grid",
        paginationDisplayMode: 'pages',
        
        muiSearchTextFieldProps: {
            size: 'small',
            variant: 'outlined',
        },
        muiPaginationProps: {
            sx: {
                pd: 0,
            },
            color: 'primary',
            rowsPerPageOptions: [10, 15, 20, 30, 50],
            variant: 'filled',
        },
        muiTableHeadCellProps: {
            sx: {
                overflow: "hidden",
                boxShadow: "none",
                "& .Mui-TableHeadCell-ResizeHandle-Wrapper": {
                    position: 'absolute',
                    right: 0,
                },
            }
        },
        muiTableContainerProps: ({ table }) => ({
            style: {
                overflow: "auto",
            },
        }),
        muiTablePaperProps: ({ table }) => ({
            //not sx
            elevation: theme.palette.mode == "dark" ? 1 : 0,
            sx: {
                transition: 'none',
                backgroundColor: table.getState().isFullScreen ? theme.palette.background.default : 'transparent',
            },
            style: {
                overflow: "auto",
                //height of the sticky header
                zIndex: table.getState().isFullScreen ? 1200 : undefined,
            },
        }),
        muiTableBodyRowProps: {
            sx: {
                backgroundColor: 'transparent',
            }
        },
        muiTableBodyCellProps: {
            sx: {
                border: "none",
                boxShadow: "none"
            }
        },
        muiToolbarAlertBannerProps: isLoadingError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        getRowId: (row) => row.id,
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreate,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSave,
        //optionally customize modal content
        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Create New User</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    {internalEditComponents} {/* or render custom edit components here */}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </DialogActions>
            </>
        ),
        renderDetailPanel: ({ row }) => (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">Pending</Typography>
                </Box>
            </Box>
        ),
        //optionally customize modal content
        renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Edit User</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                    {internalEditComponents} {/* or render custom edit components here */}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </DialogActions>
            </>
        ),
        renderRowActionMenuItems: ({ row }) => [

            <MenuItem key="edit" onClick={() => table.setEditingRow(row)}>
                <ListItemIcon>
                    <EditIcon color='primary'/>
                </ListItemIcon>
                <ListItemText primary="Edit" />
            </MenuItem>,

            <MenuItem key="delete" onClick={() => openDeleteConfirmModal(row)}>
                <ListItemIcon>
                    <DeleteIcon color='error'/>
                </ListItemIcon>
                <ListItemText primary="Delete" />
            </MenuItem>,

        ],
        renderBottomToolbar: ({ table }) => {

            return (
                <Box
                    sx={(theme) => ({
                        backgroundColor: lighten(theme.palette.background.default, 0.05),
                        px: 2,
                        py: .5,

                        display: 'flex',
                        alignItems: "center",
                        justifyContent: 'flex-end',
                        gap: '0.5rem',

                        "& > .MuiButtonBase-root": {
                            height: "fit-content",
                            paddingBlock: .45,
                            paddingInline: 1,
                            fontSize: 13
                        },
                        "& .MuiFormLabel-root": {
                            fontSize: 14
                        },
                        "& #mrt-rows-per-page": {
                            paddingLeft: 1,
                            paddingBlock: .5
                        },
                        "& .MuiTablePagination-root": {
                            padding: 0,
                            paddingLeft: 0,
                            paddingBlock: 0,
                        },
                        "& .MuiTablePagination-root": {
                            justifyContent: "flex-end"
                        }
                    })}
                >
                    <MRT_TablePagination table={table} />
                </Box>
            );
        },
        renderTopToolbar: ({ table }) => {

            return (
                <Box
                    sx={(theme) => ({
                        backgroundColor: lighten(theme.palette.background.default, 0.05),
                        padding: 2,
                        display: 'flex',
                        alignItems: "center",
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                    })}
                >
                    <Box sx={{
                        [theme.breakpoints.up('sm')]: {
                            display: 'flex', gap: '0.5rem', height: "fit-content", alignItems: 'center',
                        },
                    }}>

                        <MRT_ToggleGlobalFilterButton sx={{
                            [theme.breakpoints.only('xs')]: {
                                display: 'none',
                            },
                        }} table={table} />
                        <MRT_GlobalFilterTextField table={table} />
                        <MRT_ToggleFiltersButton table={table} />
                        <MRT_ShowHideColumnsButton table={table} />
                        <MRT_ToggleDensePaddingButton table={table} />
                        <MRT_ToggleFullScreenButton table={table} />
                    </Box>
                    <Button
                        variant="contained"
                        sx={{
                            px: 2,
                            py: 1.5,
                        }}
                        onClick={() => {
                            table.setCreatingRow(true); //simplest way to open the create row modal with no default values
                            //or you can pass in a row object to set default values with the `createRow` helper function
                            // table.setCreatingRow(
                            //   createRow(table, {
                            //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
                            //   }),
                            // );
                        }}
                    >
                        Create New User
                    </Button>
                </Box>
            );
        },
        state: {
            isLoading: isLoadingRecords,
            isSaving: isCreatingUser || isUpdatingRecords || isDeletingRecords,
            showAlertBanner: isLoadingError,
            showProgressBars: isFetchingRecords,
        },
    });

    return (
        <MaterialReactTable table={table} />
    )
};




const Table = (props) => (
    //Put this with your other react-query providers near root of your app
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Example {...props} />
    </LocalizationProvider>
);

export default Table;


