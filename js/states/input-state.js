function InputState() {

  self = this
  const testUrl = "https://docs.google.com/spreadsheets/d/1go7xaFFOhF4cRRrJKhp0-7GAMSBbaVo_YtLrLLPa-uY/edit?usp=sharing"

    self.enter = function(option) {
      APP.ui.showView("input")

      document.getElementById("run-button").onclick = function () {
        const url = document.getElementById("user-url").value
        if (url !== "") {
          APP.stator.go("chart", {url: url})
        } else {
          console.log("error")
          window.alert("Please input a valid URL!")
        }
      }

      document.getElementById("demo-button").onclick = function () {
        console.log("test")
        APP.stator.go('chart', {url: testUrl})
      }
    }

    self.leave = function(option) {
      
    }

    return self
}