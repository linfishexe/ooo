/**
 * calc_shap.js
 * 計算夏普值 (Sharpe Ratio)
 */

class SharpeCalculator {
    /**
     * @param {number[]} values - 每日資金水位的陣列 (由 calcValues 產出)
     * @param {number} riskFreeRate - 年化無風險利率 (小數點，例如 2% 傳入 0.02，預設為 0)
     * @returns {number} 年化夏普值
     */
    static calculate(values, riskFreeRate = 0) {
        if (!values || values.length < 2) {
            console.warn("數據不足，無法計算夏普值");
            return 0;
        }

        // 1. 計算每日報酬率 (Daily Returns)
        // 公式: (今天水位 - 昨天水位) / 昨天水位
        const dailyReturns = [];
        for (let i = 1; i < values.length; i++) {
            const current = values[i];
            const prev = values[i - 1];
            
            // 避免除以 0 的錯誤
            if (prev === 0) {
                dailyReturns.push(0); 
            } else {
                const ret = (current - prev) / prev;
                dailyReturns.push(ret);
            }
        }

        // 2. 計算平均每日報酬 (Mean)
        const sumReturns = dailyReturns.reduce((acc, val) => acc + val, 0);
        const avgDailyReturn = sumReturns / dailyReturns.length;

        // 3. 計算每日報酬的標準差 (Standard Deviation)
        // 公式: sqrt( sum((x - mean)^2) / (N - 1) )  -> 使用樣本標準差
        const squaredDiffs = dailyReturns.map(val => Math.pow(val - avgDailyReturn, 2));
        const avgSquaredDiff = squaredDiffs.reduce((acc, val) => acc + val, 0) / (dailyReturns.length - 1);
        const dailyStdDev = Math.sqrt(avgSquaredDiff);

        // 如果波動率為 0 (例如完全沒交易，資金平躺)，夏普值無法計算 (分母為0)
        if (dailyStdDev === 0) return 0;

        // 4. 將無風險利率轉為日利率
        // 假設一年 252 個交易日
        const dailyRiskFree = riskFreeRate / 252;

        // 5. 計算日夏普值 (Daily Sharpe)
        const dailySharpe = (avgDailyReturn - dailyRiskFree) / dailyStdDev;

        // 6. 計算年化夏普值 (Annualized Sharpe)
        // 日夏普值 * sqrt(252)
        const annualizedSharpe = dailySharpe * Math.sqrt(252);

        return parseFloat(annualizedSharpe.toFixed(4)); // 回傳保留4位小數
    }
}

module.exports = SharpeCalculator;