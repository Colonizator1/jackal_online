  const SPREADSHEET_URL = 'PASTE_HERE_YOUR_SPREADSHEET_URL';
  const ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  const ui = SpreadsheetApp.getUi();
  const board = ss.getSheetByName('board');
  const sheetGame = ss.getSheetByName('game_process');
  const sheetDeck = ss.getSheetByName('deck');
  const deckRange = sheetDeck.getRange('D2:D118');
  const activeDeckRange = sheetGame.getRange('C2:C118');
  const playerCount = board.getRange('G1').getValue();
  const colors = ['green','red','blue','yellow'];
  const rotatableCards = [5,6,7,8,20];

const startGame = () => {
  let response = ui.alert('Are you sure you want to start new game?', ui.ButtonSet.YES_NO);
  if (response == ui.Button.YES) {
	  board.getRange(2,1,100,100).clearContent();
	  sheetGame.getRange(2,1,100,3).clearContent();
	  deletImages(board);
	  
	  deckRange.copyTo(activeDeckRange);
	  let shuffledArr = shuffle(activeDeckRange.getValues());
	  activeDeckRange.setValues(shuffledArr);
	  buildClassicIsland(board.getRange('D3'));
	  let i = playerCount;
	  while (i > 0) {
		 board.insertImage('https://raw.githubusercontent.com/Colonizator1/jackal_online/master/img/ship.jpg', 6+i+1, 1, 70, 0);
		 i--;
	  }
	  insertPeoplesImage(playerCount);
	  let gold = 10;
	  while (gold > 0) {
		 board.insertImage('https://raw.githubusercontent.com/Colonizator1/jackal_online/master/img/gold.png', 15, 3, 30, +gold+3);
		 gold--;
	  }
  } else {
    return false;
  }
}
  
const buildClassicIsland = (startRange) => {
  let startRow = startRange.getRow();
  let startColumn = startRange.getColumn();
  let islandRange = board.getRange(startRow,startColumn,11,11);
  islandRange.setValue('=IMAGE("https://raw.githubusercontent.com/Colonizator1/jackal_online/master/img/face_down.jpg")');
  islandRange.getCell(1,1).setValue('');
  islandRange.getCell(11,1).setValue('');
  islandRange.getCell(1,11).setValue('');
  islandRange.getCell(11,11).setValue('');
}

const openActiveCardRandom = () => {
  let activeCell = SpreadsheetApp.getActiveSpreadsheet().getActiveRange().getCell(1,1);
  if (activeCell.getFormula() !== '=IMAGE("https://raw.githubusercontent.com/Colonizator1/jackal_online/master/img/face_down.jpg")') {
    ui.alert('You can\'t open blank or opend card!');
    return false;
  }
  let card = getRandomCart(activeDeckRange);
  let cardId = card.getValue();
  deleteCard(card);
  if (rotatableCards.includes(cardId)) {
     let rotateId = getRandomInt(4);
     cardId = cardId + '-' + rotateId;
  }
  activeCell.setValue('=IMAGE("https://raw.githubusercontent.com/Colonizator1/jackal_online/master/img/'+ cardId +'.jpg")');
}

const deleteCard = (range) => {
  range.deleteCells(SpreadsheetApp.Dimension.ROWS);
}
const getId = (url) => {
  let urlParts = new URL(url);
  return urlParts.get('id');
}

const insertPeoplesImage = (playerCount) => {
  while (playerCount > 0) {
    let soldiersCount = 3;
    let drawnRaw = playerCount * 3;
    const horizontOffset = 100;
    let currentHorizontOffset = 0;
    while (soldiersCount > 0) {
      let soldier = 'https://raw.githubusercontent.com/Colonizator1/jackal_online/master/img/pirates/'+colors[playerCount - 1]+'-pirate-0'+soldiersCount+'.png';
      board.insertImage(soldier, 1, drawnRaw, currentHorizontOffset, 0);
      currentHorizontOffset = currentHorizontOffset + horizontOffset;
      soldiersCount--;
    }
    playerCount--;
  }
}
const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}
const getRandomCart = (someRange) => {
  let lengthOfRange = getLengthRange(someRange);
  if (lengthOfRange == 0) {
      sheetGame.getRange(currentRotate).setValue('over');
      sheetGame.getRange(currentImageId).setValue('game');
      throw 'End of Game';
  }
  let column = someRange.getColumn();
  let actualDeck = sheetGame.getRange(2,column,lengthOfRange,column);
  let indexOfId = getRandomInt(lengthOfRange - 1) + 1;
  let randomCard = someRange.getCell(indexOfId,1);
  return randomCard;
}
  
const shuffle = (a) => {
  let i = a.length - 1;
  while ( i > 0) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
    i--;
  }
  return a;
}
const getLengthRange = (range) => {
  let array = range.getValues();
  return array.filter(String).length;
}
const deletImages = (range) => {
  let images = range.getImages();
  images.map(function(img){img.remove();});
}
