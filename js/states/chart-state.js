function ChartState() {

  function showInfo(spreadSheetData, tabletop) {
    APP.ui.showView("chart")
    document.querySelector("section.chart-container #back-button").onclick = function () {
      APP.stator.go("input")
    }
    const processedData = APP.dataProcessor.process(spreadSheetData)
    console.log("data: ", processedData)
    const treeData = processedData.tree
    const treeLevels = processedData.levels
    const treeDepth = processedData.depth
    APP.tree.plot(treeData, treeLevels, treeDepth)

    document.getElementById("download-button").onclick = function () {
      console.log("download")
      APP.crowbar = APP.crowbar || new Crowbar()
    }
  }

  self = this

    self.enter = function(option) {
      APP.ui.showView("loader")
      Tabletop.init({
        key: option.params.url,
        callback: showInfo,
        simpleSheet: true
      })
    }
    self.leave = function(option) {
      document.querySelector("section.chart-container #chart svg").remove()
      document.getElementById("user-url").value = ""
    }

    return self
}