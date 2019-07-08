;(function(window, undefined) {

    window.APP = {}
    
    const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1zu9abUyBMr9NixxCs0yPhX0vcutec1illVoNQIz-rDs/edit?usp=sharing'

    APP.init = function() {
        APP.dataProcessor = new DataProcessor()
        APP.tree = new Tree()
        Tabletop.init({ key: publicSpreadsheetUrl,
            callback: showInfo,
            simpleSheet: true
        })
    }

    function showInfo(spreadSheetData, tabletop) {
        //console.log(spreadSheetData)
        const processedData = APP.dataProcessor.process(spreadSheetData)
        //console.log("data: ", processedData)
        APP.tree.plot(processedData)
    }
   
    document.addEventListener("DOMContentLoaded", function(e) { 
        console.log('ready')
        APP.init()
    })

})(window)