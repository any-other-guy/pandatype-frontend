export const formatMilliseconds = (milliseconds) => {
  const formattedTime = new Date(0);
  formattedTime.setMilliseconds(milliseconds);
  //TODO: better formatting, no zeros on single digit
  if (milliseconds < 10000) return formattedTime.toISOString().slice(18, 19);
  return formattedTime.toISOString().slice(17, 19);
};

export const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};
