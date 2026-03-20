import {
  Button,
  Chip,
  CircularProgress,
  Container,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { CryptoState } from '../CryptoContext';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 24,
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#16171a',
    color: 'white',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  row: {
    borderTop: '1px solid #2b2c2f',
    padding: '12px 0',
  },
  articleLink: {
    color: '#04b5e5',
    textDecoration: 'none',
  },
  muted: {
    color: '#9aa0a6',
    marginTop: 8,
  },
}));

const scoreToLabel = (score) => {
  if (score > 0) return { text: 'Positive', color: '#2e7d32' };
  if (score < 0) return { text: 'Negative', color: '#c62828' };
  return { text: 'Neutral', color: '#6d4c41' };
};

const NewsSentiment = () => {
  const classes = useStyles();
  const {
    user,
    newsArticles,
    sentiments,
    newsLoading,
    newsError,
    fetchLatestNews,
    lastNewsUpdatedAt,
  } = CryptoState();

  if (!user) {
    return (
      <Container>
        <Paper elevation={4} className={classes.root}>
          <Typography variant="h5">Latest News Sentiment</Typography>
          <Typography className={classes.muted}>
            Login to load backend-powered crypto news and sentiment.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container>
      <Paper elevation={4} className={classes.root}>
        <div className={classes.headerRow}>
          <Typography variant="h5">Latest News Sentiment</Typography>
          <Button
            variant="outlined"
            onClick={fetchLatestNews}
            disabled={newsLoading}
            style={{ borderColor: '#04b5e5', color: '#04b5e5' }}
          >
            Refresh
          </Button>
        </div>

        {lastNewsUpdatedAt && (
          <Typography className={classes.muted}>
            Last updated: {new Date(lastNewsUpdatedAt).toLocaleString()}
          </Typography>
        )}

        {newsLoading && (
          <div style={{ marginTop: 12 }}>
            <CircularProgress size={24} style={{ color: '#04b5e5' }} />
          </div>
        )}

        {newsError && (
          <Typography style={{ color: '#ff6b6b', marginTop: 12 }}>
            {newsError}
          </Typography>
        )}

        {!newsLoading && !newsError && sentiments.length === 0 && (
          <Typography className={classes.muted}>No sentiment records yet.</Typography>
        )}

        {!newsLoading &&
          sentiments.slice(0, 10).map((entry) => {
            const badge = scoreToLabel(entry.score || 0);
            const article = newsArticles.find((item) => item.url === entry.articleUrl);
            const source = article?.source?.name || 'Unknown source';

            return (
              <div className={classes.row} key={entry.articleUrl || `${entry.title}-${entry.timestamp}`}>
                <Typography variant="subtitle1" style={{ marginBottom: 8 }}>
                  {entry.title}
                </Typography>
                <Chip
                  size="small"
                  label={`${badge.text} (${entry.score ?? 0})`}
                  style={{ backgroundColor: badge.color, color: 'white' }}
                />
                <Typography className={classes.muted}>Source: {source}</Typography>
                {article?.url && (
                  <Typography style={{ marginTop: 6 }}>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className={classes.articleLink}
                    >
                      Read article
                    </a>
                  </Typography>
                )}
              </div>
            );
          })}
      </Paper>
    </Container>
  );
};

export default NewsSentiment;
