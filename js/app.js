;(function(window, undefined) {

    window.APP = {}
    
    APP.init = function() {
        const viewportWidth = document.querySelector("main").offsetWidth
        APP.dataProcessor = new DataProcessor()
        APP.tree = new Tree(viewportWidth)

        document.querySelector("section.input-container").style.display = "flex"
        document.querySelector("section.chart-container").style.display = "none"
        
        const testUrl = 'https://docs.google.com/spreadsheets/d/1zu9abUyBMr9NixxCs0yPhX0vcutec1illVoNQIz-rDs/edit?usp=sharing'

        document.getElementById("run-button").onclick = function() {
            const url = document.getElementById("user-url").value
            if (url !== "") {
                Tabletop.init({ key: url,
                    callback: showInfo,
                    simpleSheet: true
                })
            } else {
                console.log("test!")
                Tabletop.init({ key: testUrl,
                    callback: showInfo,
                    simpleSheet: true
                })
            }
        }

        // document.getElementById("svg-button").onclick = function() {
        //     APP.crowbar = new Crowbar()
        // }

        // document.getElementById("section.chart-container #back-button").onclick = function() {
        //     console.log("hey!")
        //     document.querySelector("section.input-container").style.display = "flex"
        //     document.querySelector("section.chart-container").style.display = "none"
        // }

    }

    function showInfo(spreadSheetData, tabletop) {
        document.querySelector("section.chart-container").style.display = "flex"
        document.querySelector("section.input-container").style.display = "none"
        document.querySelector("section.chart-container #back-button").onclick = function() {
            document.querySelector("section.chart-container #chart svg").remove()
            document.querySelector("section.input-container").style.display = "flex"
            document.querySelector("section.chart-container").style.display = "none"
            document.getElementById("user-url").value = ""
        }
        //console.log(spreadSheetData)
        const processedData = APP.dataProcessor.process(spreadSheetData)
        console.log("data: ", processedData)
        APP.tree.plot(processedData)
    }
   
    document.addEventListener("DOMContentLoaded", function(e) { 
        console.log('ready')
        APP.init()
    })

})(window)