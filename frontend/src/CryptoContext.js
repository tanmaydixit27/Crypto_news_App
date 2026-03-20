import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { CoinList } from './config/api';
import { SOCKET_URL } from './config/backend';
import { auth, db } from './firebase';
import { getLatestNews } from './services/newsService';

const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState('INR');
  const [symbol, setSymbol] = useState('INR');
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    type: 'Success',
  });
  const [watchlist, setWatchlist] = useState([]);

  const [newsArticles, setNewsArticles] = useState([]);
  const [sentiments, setSentiments] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');
  const [lastNewsUpdatedAt, setLastNewsUpdatedAt] = useState(null);

  useEffect(() => {
    if (!user) {
      setWatchlist([]);
      return undefined;
    }

    const coinRef = doc(db, 'watchlist', user.uid);
    const unsubscribe = onSnapshot(coinRef, (coin) => {
      if (coin.exists()) {
        setWatchlist(coin.data().coins || []);
      } else {
        setWatchlist([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser || null);
    });

    return () => unsubscribe();
  }, []);

  const fetchCoins = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(CoinList(currency));
      setCoins(data);
    } finally {
      setLoading(false);
    }
  }, [currency]);

  const fetchLatestNews = useCallback(async () => {
    if (!user) {
      setNewsError('Login required for news feed.');
      setNewsArticles([]);
      setSentiments([]);
      return;
    }

    setNewsLoading(true);
    setNewsError('');
    try {
      const token = await user.getIdToken();
      const data = await getLatestNews(token);
      setNewsArticles(data.articles || []);
      setSentiments(data.sentiments || []);
      setLastNewsUpdatedAt(Date.now());
    } catch (error) {
      const message = error?.response?.data?.error || error.message || 'Failed to load news';
      setNewsError(message);
      setAlert({
        open: true,
        message,
        type: 'error',
      });
    } finally {
      setNewsLoading(false);
    }
  }, [user, setAlert]);

  useEffect(() => {
    if (currency === 'INR') setSymbol('\u20B9');
    else if (currency === 'USD') setSymbol('$');
  }, [currency]);

  useEffect(() => {
    if (!user) {
      setNewsArticles([]);
      setSentiments([]);
      setNewsError('');
      setLastNewsUpdatedAt(null);
      return undefined;
    }

    fetchLatestNews();
    return undefined;
  }, [user, fetchLatestNews]);

  useEffect(() => {
    if (!user) return undefined;

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socket.on('sentiment-update', (payload) => {
      if (Array.isArray(payload)) {
        setSentiments(payload);
        setLastNewsUpdatedAt(Date.now());
      }
    });

    socket.on('connect_error', () => {
      setNewsError((prev) => prev || 'Realtime updates are currently unavailable.');
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <Crypto.Provider
      value={{
        currency,
        symbol,
        setCurrency,
        coins,
        loading,
        fetchCoins,
        alert,
        setAlert,
        user,
        watchlist,
        setWatchlist,
        newsArticles,
        sentiments,
        newsLoading,
        newsError,
        fetchLatestNews,
        lastNewsUpdatedAt,
      }}
    >
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => useContext(Crypto);
