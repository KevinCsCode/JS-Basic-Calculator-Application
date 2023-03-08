let inputString = '';
let resultValue = NaN;
let lastKeyStrokeIsEquals = false;
let lastCompleteNumber = '';
/**
 * Function called when pressing any button other than the equals and 'AC' buttons
 * @param {String} btnValue
 */
function normalButtonPress(btnValue) {
    //Case 1: if we already have a decimal point in the latest number, then ignore any subsequent presses of '.
    if ((Math.round(lastCompleteNumber) !== Number(lastCompleteNumber) && btnValue === '.') ||(lastCompleteNumber === '0' && btnValue === '0')) {
        //Do nothing
        console.log(Math.round(lastCompleteNumber),lastCompleteNumber);
    } else {
        //Case 2a: if we have not already called the equals operator, then we just append the button value to the input string
        let lastChar = '';
        inputString.length > 0 ? lastChar = inputString.charAt(inputString.length - 1) : lastChar = lastChar;
        if (!lastKeyStrokeIsEquals) {
            lastChar === '.' && btnValue === '.' ? inputString = inputString : inputString = inputString + btnValue;
        }
        //Case 2b: if we have already called the equals operator, then we wrap the preceding input in brackets, then append the button value to that expression
        else {
            inputString = '(' + inputString + ')' + btnValue;
        }

        //If the button is not a number, then we don't display it in the main display section of the calculator
        if (adaptedIsNaN(btnValue)) {
            lastCompleteNumber = '';
        }
        //If the button is a number, then we display the complete number in the main display section of the calculator, and we keep track of the number value
        else {
            lastChar === '.' && btnValue === '.' ? lastCompleteNumber = lastCompleteNumber: lastCompleteNumber = lastCompleteNumber + btnValue;
            myDisplayElement = document.getElementById('display');
            myDisplayElement.innerHTML = '<p>' + lastCompleteNumber + '</p>';
        }

        //We show all our workings in the upper section of the display
        myWorkings = document.getElementById('display-workings');
        myWorkings.innerHTML = '<p>' + inputString + '</p>';

        //After we have completed all our changes, we make sure to mark it that the last action was not to press the equals key
        lastKeyStrokeIsEquals = false;
    }
}
/**
 * Sub for clearing the display/workings/input string when the user presses the 'AC' button
 */
function clearButtonPress() {
    inputString = '';
    lastCompleteNumber = '';
    resultValue = NaN;
    document.getElementById('display').innerHTML = '<p>0</p>';
    document.getElementById('display-workings').innerHTML = '';
    lastKeyStrokeIsEquals = false;
}

/**
 * Checks whether a string (usually the button value) is an operation (but not a decimal), i.e. -,+,*,/
 * @param {String} myInputString
 */
function adaptedIsNaN(myInputString) {
    let allowedSpecialChars = ['.', '(', ')'];
    console.log(isNaN(myInputString) && !allowedSpecialChars.includes(myInputString));
    return (isNaN(myInputString) && !allowedSpecialChars.includes(myInputString));
}

/** 
 * Called when the user presses the = button.
 * Per requirements in the FreeCodeCamp challenge, if there are successive operation characters in the input string, then we only evaluate the right-most operation.
 */
function pressEqualsButton() {
    let replacementList = [
        {wrongString: '-+',rightString: '+'},
        {wrongString: '-*',rightString: '*'},
        {wrongString: '-/',rightString: '/'},
        {wrongString: '--',rightString: '-'},
        {wrongString: '*+',rightString: '+'},
        {wrongString: '+*',rightString: '*'},
        {wrongString: '*/',rightString:'/'},
        {wrongString: '/*',rightString: '*'},
        {wrongString: '+/',rightString: '/'},
        {wrongString: '/+',rightString:'+'}
    ]
    const eliminateInvalidOperationsInString = (myInputString) => {
        let outputString = myInputString;
        while (checkForInvalidPairInString(outputString)) {
            replacementList.forEach((pair) => {
                outputString = outputString.replace(pair.wrongString, pair.rightString);
            })
        }
        return outputString;
    }
    const checkForInvalidPairInString = (myInputString) => {
        let res = false;
        res = replacementList.some((pair) => myInputString.includes(pair.wrongString));
        return res;
    }

    try {
        //We take the input string, split it into an array
        let tmpInputString = eliminateInvalidOperationsInString(inputString);
        let tmpInputStringArray = tmpInputString.split('');
        //Check if a character is an operation is of type +,*,/
        tmpInputStringArray = tmpInputStringArray.map((item) => [item, /\+/.test(item) || /\*/.test(item) || /\//.test(item)]);
        //Check if a character is one of the marked operations and the subsequent character also is
        tmpInputStringArray = tmpInputStringArray.map((item, index) => [item[0], index < tmpInputStringArray.length && item[1] && tmpInputStringArray[index+1][1]]);
        //If yes, then get rid of that character
        tmpInputStringArray = tmpInputStringArray.filter((item) => item[1] == false).map((item) => item[0]);
        //Finally we knit the resultant array together into a string to be evaluated
        tmpInputString = tmpInputStringArray.join('');
        tmpInputString = eliminateInvalidOperationsInString(tmpInputString);
        
        resultValue = eval(tmpInputString);

        myDisplayElement = document.getElementById('display');
        if (Number.isInteger(Number(resultValue))) {
            myDisplayElement.innerHTML = '<p>' + resultValue + '</p>';
        } else {
            myDisplayElement.innerHTML = '<p>' + String(parseFloat(resultValue).toFixed(4)).replace(/0+$/,'') + '</p>';
        }
        lastKeyStrokeIsEquals = true;
    } catch (e) {
        console.log(e);
    }
    
}