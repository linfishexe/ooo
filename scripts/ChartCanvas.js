/**
 * 用來繪製趨勢的圖表
 * @class
 */
class ChartCanvas {

    /** 畫布 @type {HTMLCanvasElement} */ 
    canvas;

    /** 圖表 @type {Chart} */ 
    chart

    /**
     * 建立一個圖表繪製工具
     * @constructor
     * @param {HTMLElement} container - 用來放置圖表的容器
     * @returns {void}
    */
    constructor(container) {
        container.replaceChildren();
        this.canvas = document.createElement( "canvas" );
        container.appendChild( this.canvas );
    }

    /**
     * 建立一個圖表繪製工具
     * @constructor
     * @param {string[]} labels - 圖表中每筆資料的標籤
     * @param {number[]} values - 圖表中每筆資料的數值
     * @returns {void}
    */
    drawChart(labels, datasets) {
        if (this.chart) { this.chart.destroy(); }
        const context = this.canvas.getContext("2d");
        const chartSettings = {
            type: "line",
            data: {
                labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                scales: {
                    x: { title: { display: true, text: "天數" } },
                    y: { 
                        title: { display: true, text: "資金水位 (元)" },
                        ticks: {
                            callback: function(value) {
                                return (value / 10000).toLocaleString() + "萬";
                            }
                        }
                    }
                }
            }
        }
        this.chart = new Chart(context, chartSettings);
    }
}