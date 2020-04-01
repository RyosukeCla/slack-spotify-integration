exports.timeout = function(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject()
    }, ms)
  })
}