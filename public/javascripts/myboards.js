var deleteButton = document.querySelectorAll('.deleteButton')
deleteButton.forEach(item => {
  item.addEventListener('click', event => {
    var boardID = item.id.split(" ")[1]
    console.log("id: ", item.id.split(" ")[1])
    var removedBoard = document.getElementById(boardID)

    var req = new XMLHttpRequest();
    var reqUrl = '/my-boards/delete-board'
    req.open('DELETE', reqUrl)

    var userBoard = {
      id: boardID
    }
    var reqBody = JSON.stringify(userBoard)

    req.setRequestHeader('Content-Type', 'application/json')

    removedBoard.parentElement.remove();

    req.send(reqBody)
  })
})