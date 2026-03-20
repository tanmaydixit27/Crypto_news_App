import { colors, Container, createTheme, LinearProgress, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { CoinList } from '../config/api';
import { CryptoState } from '../CryptoContext';
import { coinWithComa } from './Banner/Corousels';
import { Pagination } from "@material-ui/lab"


const CoinTable = () => {
    const { currency, symbol, coins, loading, fetchCoins } = CryptoState();
    const [page, setpage] = useState(1)
    const [search, setSearch] = useState("");
    const history = useHistory();

    useEffect(() => {
        fetchCoins();
    }, [currency])

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff"
            },
            type: "dark",
        }
    });

    const handleSearch = () => {
        return coins.filter((coin) => (
            coin.name.toLowerCase().includes(search) || coin.symbol.toLowerCase().includes(search)
        ));
    }

    const useStyles = makeStyles(() => ({
        row: {
            backgroundColor: "#16171a",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "#131111",
            },
            fontFamily: "Montserrat"
        },
        pagination: {
            "& .MuiPaginationItem-root": {
                color: "#04b5e5"
            }

        }

    }))

    const classes = useStyles();


    return (

        <ThemeProvider theme={darkTheme}>
            <Container style={{ textAlign: "center" }}>
                <Typography
                    variant='h4'
                    style={{ margin: 18, fontFamily: "Montserrat", color: "white" }}
                >
                    Crypto Currency Prices By Market Cap
                </Typography>
                <TextField
                    label="Search For A Crypto Currency..."
                    variant='outlined'
                    style={{ marginBottom: 20, width: "100%" }}
                    onChange={(e) => setSearch(e.target.value)}
                >

                </TextField>
                <TableContainer>
                    {loading ? (
                        <LinearProgress style={{ backgroundColor: "#04b5e5" }}></LinearProgress>
                    ) : (
                        <>

                            <Table>
                                <TableHead style={{ backgroundColor: "#04b5e5" }}>
                                    <TableRow>
                                        {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                                            <TableCell
                                                style={{
                                                    color: "black",
                                                    fontWeight: "700",
                                                    fontFamily: "Montserrat"
                                                }}
                                                key={head}
                                                align={head === "Coin" ? "" : "right"}
                                            >
                                                {head}
                                            </TableCell>

                                        ))}

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {handleSearch().slice((page - 1) * 10, (page - 1) * 10 + 10).map((row) => {
                                        let profit = row.price_change_percentage_24h > 0;
                                        return (
                                            <TableRow
                                                onClick={() => history.push(`/coins/${row.id}`)}
                                                className={classes.row}
                                                key={row.name}
                                            >
                                                <TableCell component='th'
                                                    scope="row"
                                                    style={{
                                                        display: "flex",


                                                        gap: 15
                                                    }}
                                                >
                                                    <img
                                                        src={row?.image}
                                                        alt={row.name}
                                                        height="50"
                                                        style={{ marginBottom: 10 }}
                                                    ></img>
                                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                                        <span style={{ textTransform: "uppercase", fontSize: 22 }}>
                                                            {row.symbol}
                                                        </span>
                                                        <span style={{ color: "darkgrey" }}>{row.name}</span>
                                                    </div>

                                                </TableCell>
                                                <TableCell align='right'>
                                                    {symbol}{" "}
                                                    {coinWithComa(row.current_price.toFixed(2))}
                                                </TableCell>
                                                <TableCell
                                                    align='right'
                                                    style={{
                                                        color: profit > 0 ? "rgba(14,203,129)" : "red",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {profit && "+"}
                                                    {row.price_change_percentage_24h.toFixed(2)}%
                                                </TableCell>
                                                <TableCell align='right'>
                                                    {symbol}{" "}
                                                    {coinWithComa(row.market_cap.toString().slice(0, -6))}M
                                                </TableCell>

                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </>
                    )}
                </TableContainer>
                <Pagination
                    style={{
                        padding: 20,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                    count={(handleSearch()?.length / 10).toFixed(0)}
                    classes={{ ul: classes.pagination }}
                    onChange={(_, value) => {
                        setpage(value);
                        window.scroll(0, 450);
                    }}
                >

                </Pagination>
            </Container>

        </ThemeProvider>
    )
}

export default CoinTable