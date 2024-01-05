'use client'
import {
    Box,
    Button,
    ListItemIcon,
    MenuItem,
    lighten,
    ListItemText,
    Paper,
} from '@mui/material';
import {
    useMaterialReactTable,
    MRT_GlobalFilterTextField,
    MRT_ToggleFiltersButton,
    MRT_TablePagination,
    MRT_ToggleDensePaddingButton,
    MRT_ToggleGlobalFilterButton,
    MRT_ToggleFullScreenButton,
    MRT_ShowHideColumnsButton,
    MaterialReactTable,
} from 'material-react-table';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@emotion/react';
import Prompt from '@/components/Table/Prompt';
import { useState } from 'react';

export const Table = (props) => {
    const theme = useTheme()

    const { onCreatingRowCancel, onEditingRowCancel } = props
    const { openDeleteConfirmModal } = props
    const { createRecord, updateRecord, deleteRecord } = props
    const { columns, initialState, tableName } = props
    const { fetchedRecords } = props
    const { isCreatingRecord, isUpdatingRecord, isDeletingRecord } = props
    const { isFetchingRecords, isLoadingError, isLoadingRecords } = props

    const [creating, setCreating] = useState(false)
    const [row, setRow] = useState({})
    const [editing, setEditing] = useState(false)

    const toCreate = () => setCreating(true)
    const toEdit = (row) => {setEditing(true); setRow(row)}

    const defaultOpenDeleteConfirmModal = (row) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteRecord(row.original.id);
        }
    };

    const table = useMaterialReactTable({
        columns,
        data: fetchedRecords,
        initialState: {
            ...initialState,
            showColumnFilters: false,
            showGlobalFilter: true,
        },
        enableColumnFilterModes: true,
        enableColumnOrdering: true,
        enableGrouping: true,
        enableColumnPinning: true,
        enableFacetedValues: true,
        enableRowActions: true,
        enableRowSelection: false,
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
        muiEditRowDialogProps: {

        },
        muiPaginationProps: {
            sx: {
                pd: 0,
                marginLeft: "auto"
            },
            color: 'primary',
            rowsPerPageOptions: [10, 15, 20, 30, 50],
            variant: 'filled',
        },
        muiTableHeadCellProps: {
            sx: {
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem",
                paddingBottom: ".5rem",
                boxShadow: "none",
                border: 0,
                textTransform: "capitalize",
                "& .Mui-TableHeadCell-ResizeHandle-Wrapper": {
                    position: 'absolute',
                    right: 0,
                },
            }
        },
        muiTablePaperProps: ({ table }) => ({
            //not sx
            elevation: theme.palette.mode == "dark" ? 1 : 0,
            sx: {
                transition: 'none',
                backgroundColor: table.getState().isFullScreen ? theme.palette.background.default : 'transparent',
            },
            style: {
                overflow: "auto",
                zIndex: table.getState().isFullScreen ? 1200 : undefined,
            },
        }),
        muiTableHeadRowProps: {
            sx: {
                borderBottom: 1,
                borderColor: theme.palette.border.main
            }
        },
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
        muiTableFooterProps: {
            sx: {
                outline: "none"
            }
        },
        muiToolbarAlertBannerProps: isLoadingError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        getRowId: (row) => row.id,
        onCreatingRowCancel: () => { onCreatingRowCancel?.() },
        onEditingRowCancel: () => { onEditingRowCancel?.() },

        displayColumnDefOptions: {
            'mrt-row-actions': {
                header: 'Actions',
                size: 120,
            },
        },
        renderRowActionMenuItems: ({ row }) => [

            <MenuItem key="edit" onClick={() => toEdit(row.original)}>
                <ListItemIcon>
                    <EditIcon color='primary' />
                </ListItemIcon>
                <ListItemText primary="Edit" />
            </MenuItem>,

            <MenuItem key="delete" onClick={() => (openDeleteConfirmModal || defaultOpenDeleteConfirmModal)(row)}>
                <ListItemIcon>
                    <DeleteIcon color='error' />
                </ListItemIcon>
                <ListItemText primary="Delete" />
            </MenuItem>,

        ],
        renderBottomToolbar: ({ table }) => {
            return (
                <Paper
                    sx={(theme) => ({
                        px: 2,
                        py: 1.5,
                        borderTop: 1,
                        borderColor: theme.palette.border.main,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
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
                            paddingBlock: .5,
                            paddingBottom: .3,
                        },
                        "& .MuiTablePagination-root": {
                            padding: 0,
                            paddingLeft: 0,
                            paddingBlock: 0,
                        },
                        "& .MuiTablePagination-root": {
                            justifyContent: "flex-end",
                            padding: 0,
                            width: "100%",
                        }
                    })}
                >
                    <Box sx={(theme) => ({
                        width: "fit-content",
                        whiteSpace: "nowrap",
                        fontSize: 14,
                        marginRight: 4,

                        [theme.breakpoints.down('md')]: {
                            display: "none"
                        },
                    })}>
                        Total Record: <span style={{
                            color: theme.palette.primary.main,
                            fontSize: 16, marginLeft: 8
                        }}>
                            {fetchedRecords.length}</span>
                    </Box>
                    <MRT_TablePagination table={table} />
                </Paper>
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
                        position: "relative",
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
                        onClick={toCreate}
                    >
                        Create New {tableName || "record"}
                    </Button>
                </Box>
            );
        },
        state: {
            isLoading: isLoadingRecords,
            isSaving: isCreatingRecord || isUpdatingRecord || isDeletingRecord,
            showAlertBanner: isLoadingError,
            showProgressBars: isFetchingRecords || true || isCreatingRecord || isUpdatingRecord || isDeletingRecord,
        },
    });

    return (
        <>
            <MaterialReactTable table={table}/>
            <Prompt open={creating} close={() => setCreating(false)} title={0} name={tableName} {...{ columns, saveRecord: createRecord }}/>
            <Prompt open={editing} close={() => setEditing(false)} title={1} name={tableName} data={row}{...{ columns, saveRecord: updateRecord }}/>
        </>
    )
};

