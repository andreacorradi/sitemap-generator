function Ui() {
  let self = this

  self.showView = function (view) {
    document.querySelectorAll("section").forEach(el => el.style.display = "none")
    document.querySelector("section." + view + "-container").style.display = "flex"
  }

  return self
}