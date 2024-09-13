export const abbreviateNumbers = (num: number): string => {
  let result = num.toString();
  // If the number is 1000 or less, return the number as is.
  if (num) {
    if (num <= 1000) {
      result = num.toString();
    }

    // Determine the length of the number.
    const length = num.toString().length;

    if (length <= 3) {
      // If the number has three digits or less, resultit as a string.
      result = num.toString();
    } else if (length >= 4 && length <= 6) {
      // If the number is in the thousands, format it with one decimal place and append 'k'.
      result = (num / 1000).toFixed(1) + 'k';
    } else if (length >= 7 && length <= 9) {
      // If the number is in the millions, format it with one decimal place and append 'M'.
      result = (num / 1000000).toFixed(1) + 'M';
    } else if (length >= 10 && length <= 12) {
      // If the number is in the billions, format it with one decimal place and append 'B'.
      result = (num / 1000000000).toFixed(1) + 'B';
    } else {
      result = num.toString();
    }
  }

  return result;
};
