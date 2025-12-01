import yfinance as yf
import pandas as pd

# 股票代號（含交易所）
tickers = ['2330.TW', '2317.TW', '2454.TW', '2308.TW', '2382.TW', '2891.TW', '2881.TW', '2882.TW', '3711.TW', '2303.TW']
# 簡化顯示用代號（去掉 .TW）
ids = [t.split('.')[0] for t in tickers]

# 下載資料
data = yf.download(tickers, start='2024-12-01', end='2025-12-01')

# 取 Close，欄位改成簡化代號
close_df = data['Close'].copy()
close_df.columns = ids

# 依日期排序（保險）
close_df = close_df.sort_index()

# 四捨五入到小數點後兩位
close_df = close_df.round(2)

# 儲存成 CSV，強制顯示兩位小數
close_df.to_csv('close_prices_vertical.csv', index=False, float_format="%.2f")

# 顯示前幾列確認
print(close_df.head())
