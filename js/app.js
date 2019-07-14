;(function(window, undefined) {

    window.APP = window.APP || {}
    
    APP.init = function() {

        const viewportWidth = document.querySelector("main").offsetWidth
        APP.dataProcessor = new DataProcessor()
        APP.tree = new Tree(viewportWidth)
        APP.ui = new Ui()

        APP.stator = new window.States()
        APP.stator.init()

    }
   
    document.addEventListener("DOMContentLoaded", function(e) { 
        console.log('ready')
        APP.init()
    })

})(window)