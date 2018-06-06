module.exports = {
  setCharAt(string, index, char) {
    if (!string) {
      string = ""
    }

    if(index > string.length - 1) {
      return string + " ".repeat(index - string.length) + char
    } else {
      return string.substr(0,index) + char + string.substr(index+1);
    }
  }
}
