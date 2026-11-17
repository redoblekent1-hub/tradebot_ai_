# TRADEBOT AI PWA starter

This is an installable-web-app starter for Android. It is an educational market-monitoring dashboard, **not** a trading bot and it does not place orders.

## Data limitation
The app uses the public Frankfurter API, which publishes reference exchange rates based on central-bank data. These are generally daily reference rates, not live broker bid/ask quotes, not tick data, and not suitable for intraday execution. The app intentionally labels every quote as reference FX and outputs WAIT rather than pretending that daily data supports reliable trading signals.

## Run locally
Serve this folder over HTTPS or localhost (service workers and PWA installation require a secure context):
- Python: `python -m http.server 8000`
- Open `http://localhost:8000` on the same device for local testing.

For installation on an Android phone, deploy the folder to an HTTPS static host, open the URL in Chrome, then use the browser menu > Install app / Add to Home screen.

## Before adding more capabilities
1. Select a licensed market-data provider that supplies timestamped bid/ask and intraday candles for your intended pairs.
2. Put provider credentials on a server, never in browser JavaScript.
3. Add an economic-calendar source and document its coverage and delay.
4. Implement reproducible backtests with spread, slippage, fees, and out-of-sample testing.
5. Keep alerts informational. Do not infer profitability from signal confidence or a small sample.

## Six analysis modules
Scanner, Trend Analyzer, News Analyzer, Signal Evaluator, Risk Analyzer, Performance Tracker. In this starter these are transparent placeholders, not autonomous AI agents.
