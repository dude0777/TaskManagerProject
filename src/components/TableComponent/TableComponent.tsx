import React, { useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from '@mui/material';
import { useWindowSize } from "../../hooks/useWindowSize";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface TableData {
   
    taskName: string;
    dueOn:string;
    taskCategory: string;

    
    description: string;
    taskStatus: string;
}


const TableComponent: React.FC = () => {
    const { isMobile } = useWindowSize();
    // Sample data - replace with your actual data
    const data: TableData[] = [
        { id: 1, name: 'Task 1', description: 'Description 1', status: 'Active' },
        { id: 2, name: 'Task 2', description: 'Description 2', status: 'Pending' },
        { id: 3, name: 'Task 3', description: 'Description 3', status: 'Completed' },
    ];

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                <Typography>Task Table</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.description}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </AccordionDetails>
        </Accordion>
    );
};

export default TableComponent;