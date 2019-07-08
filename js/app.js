;(function(window, undefined) {

	window.APP = {}

	APP.init = function() {
		APP.dataProcessor = new DataProcessor()
        APP.tree = new Tree()

        d3.csv("../data/enelx_5levels.csv").then(function(csvData){
            const data = APP.dataProcessor.process(csvData)
            console.log("data: ", data)
            APP.tree.plot(data)
        })
	}
    
    document.addEventListener("DOMContentLoaded", function(e) { 
        console.log('ready')
		APP.init()
    })

})(window)