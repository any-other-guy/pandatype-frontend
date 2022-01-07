export const formatMilliseconds = (milliseconds) => {
  const formattedTime = new Date(0);
  formattedTime.setMilliseconds(milliseconds);
  //TODO: better formatting, no zeros on single digit
  if(milliseconds < 10000) return formattedTime.toISOString().slice(18, 19);
  return formattedTime.toISOString().slice(17, 19);
}