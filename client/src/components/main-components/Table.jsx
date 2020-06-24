import React from 'react'
import { useTable } from "react-table";
import '../../styles/table.css'
import {Link} from 'react-router-dom'

const Table = ({ category, columns, data, remove }) => {
    // you can get the react table functions by using the hook useTable

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable ({
        columns,
        data,
        remove
    });

    let searchEngine = (e) => {
        // Will change the code for proper one some time later
        // Bad practice code example for React...

        let column

        // Declare variables
        var input, filter, table, tr, th, trs, td, i, txtValue;
        input = e.target
        filter = input.value.toUpperCase();
        table = document.getElementById("table");
        tr = table.getElementsByClassName("normals");
        trs = table.getElementsByClassName("search")
        th = table.getElementsByTagName("th")

        for(var n = 0; n < th.length; n++) {
            if(e.target.name === th[n].innerText){
               column = n
               
            } else {
                // Emptying every filter value but not the focused one
                trs[0].getElementsByTagName("td")[n].getElementsByClassName("SearchEngine")[0].value = ""
            }
        }

        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[column];
            if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
            }
        }
    }

    return (
        <div>
        <table id="table" {...getTableProps()}>

            <thead className="theader">
                {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => {
                    const {render, getHeaderProps} = column
                    return (
                        <th {...getHeaderProps()}>{render("Header")}</th>
                    )
                    })}
                </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>

                {category ? 
                (<tr className="search">
                    {columns.map(column => {
                            if(column.filterable){
                                return <td key={column.Header}><input id={column.Header} onChange={searchEngine} name={column.Header} className="SearchEngine" type="text" placeholder="Search for value..."/></td>
                            } else {
                                return <td key={column.accessor}></td>
                            }

                    })}
                </tr>) : null
                }

                {rows.map((row, i) => {
                prepareRow(row);
                return (
                    <tr className="normals notfirst" {...row.getRowProps()}>
                    {row.cells.map(cell => {
                        return (
                            <td className="Cells" {...cell.getCellProps()}>
                                {category ? <Link to={`/${category}/${row.original._id}`}>{cell.render("Cell")}</Link> : cell.render("Cell") }
                            </td>
                        )
                    })}
                    </tr>
                );
                })}
            </tbody>

        </table>
        </div>
    );
};

export default Table