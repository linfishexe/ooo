// src/utils/finance.js

// 計算投資組合的每日資產總值
export function calculatePortfolioTrend(stocks, initialCapital) {
    if (!stocks.length) return [];

    const capitalPerStock = Math.floor(initialCapital / stocks.length);
    const days = stocks[0].data.length;

    const holdings = stocks.map((stock) => {
        const price = stock.data[0];
        const shares = Math.floor(capitalPerStock / price);
        return {
            shares,
            remain: capitalPerStock - shares * price,
            data: stock.data,
        };
    });

    // 修正餘額誤差
    const totalAllocated = holdings.reduce(
        (sum, h) => sum + h.shares * h.data[0] + h.remain,
        0,
    );
    holdings[0].remain += initialCapital - totalAllocated;

    return Array.from({ length: days }, (_, i) =>
        holdings.reduce(
            (sum, h) => sum + h.remain + (h.shares * h.data[i] || 0),
            0,
        ),
    );
}

// 計算單一股票全押走勢
export function calculateSingleStockTrend(stock, initialCapital) {
    const firstPrice = stock.data[0];
    const shares = Math.floor(initialCapital / firstPrice);
    const remain = initialCapital - shares * firstPrice;
    return stock.data.map((price) => remain + shares * price);
}

// 計算夏普比率
export function calculateSharpeRatio(values, riskFreeRate = 0) {
    if (!values || values.length < 2) return null;

    const returns = [];
    for (let i = 1; i < values.length; i++) {
        if (values[i - 1] > 0)
            returns.push((values[i] - values[i - 1]) / values[i - 1]);
    }

    if (!returns.length) return null;

    const avg = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance =
        returns.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);

    return stdDev === 0 ? null : (avg - riskFreeRate) / stdDev;
}
