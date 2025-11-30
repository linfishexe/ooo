/**
 * @typedef {Object} ParseResult
 * @property {string[][]} data - CSV 解析後的二維陣列
 */

/**
 * 負責解析 CSV 與計算投資組合
 * @class
 */
class StockDataProcessor {

    /**
     * 建立一個圖表繪製工具
     * @constructor
     * @param {ParseResult} results - CSV 解析結果
    */
    constructor() {}

    /**
     *
     * @param {ParseResult} results 
     * @returns {void}
     */
    parse(results) {
        const rows = results.data;

        /** 所有股票的名稱 @type{string[]} */
        let stockNames;

        /** 所有股票的走勢 @type{number[][]} */
        let stockDataRows;
        
        if (rows[0].length === 1) {
            // 單股 CSV
            stockNames = [rows[0][0]];
            stockDataRows = rows.slice(1).filter(r => r.length > 0 && r[0] !== "");
        } else {
            // 多股 CSV
            stockNames = rows[0];
            stockDataRows = rows.slice(1).filter(r => r.length > 1);
        }
        this.stockNames = stockNames;
        this.stockDataRows = stockDataRows;
    }

    /**
     * 根據分配資金與第一天股價，計算每檔股票的持股數量與更新後的剩餘現金
     * @param {number[]} indices 
     * @param {number} capital 
     * @param {number} remain 
     * @returns {{holdingList: {colIndex: number, shares: number}[], remain: number}}
     */
    calculateHoldings(indices, capital, remain) {
        /** @type{{colIndex: number, shares: number}[]} */
        const holdingList = [];
        let updatedRemain = remain;

        indices.forEach(colIndex => {
            const firstPrice = parseFloat(this.stockDataRows[0][colIndex]);
            const shares = Math.floor(capital / firstPrice);
            const usedCash = shares * firstPrice;
            const remainingCash = capital - usedCash;
            updatedRemain += remainingCash;
            const holding = { colIndex, shares };
            holdingList.push(holding);
        });

        return { holdingList, remain: updatedRemain };
    }

    /**
     * 計算每一天投資組合的總資金水位（持股市值 + 剩餘現金）
     * @param {{colIndex: number, shares: number}[]} holdingList 
     * @param {number} remain 
     * @returns {number[]}
     */
    calculatePortfolioValues(holdingList, remain) { 
        const values = this.stockDataRows.map(row => {
            let value = remain;
            holdingList.forEach(h => {
                const price = parseFloat(row[h.colIndex]);
                if (!isNaN(price)) { value += h.shares * price; }
            });
            return Math.round(value); // 四捨五入
        });
        return values;
    }
}
