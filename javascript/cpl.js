var width = 940;
var cpl = 50;
var bodyMargin = 10;
var fontType = "monospace";
var fontTypeConstants = {
    serif: 2.3333,
    sansSerif: 2.2513,
    monospace: 1.67,
    Georgia: 2.27
};
var textElement = document.querySelector("[data-cpl-text]");

function updateText (event) {
    var inputElement = event.currentTarget;
    var valueElement = inputElement.nextElementSibling || null;
    
    var inputValue = inputElement.value;
    
    var dataType = inputElement.getAttribute("data-type");
    var fontType = "monospace";
    
    if (dataType === "width") {
        width = inputValue;
        textElement.style.width = width + "px";
    }

    if (dataType === "cpl") {
        cpl = inputElement.value;
    }

    if (dataType === "text") {
        textElement.innerHTML = inputElement.value;
    }

    if (valueElement) {
        valueElement.innerHTML = inputValue;
    }

    addSpanElements(textElement);
    updateCharacterCountUI(textElement);

    textElement.style.fontSize = getCPLFontSize(width, cpl, fontType);

}

function getCPLFontSize(width, cpl, fontType) {
    var constant = fontTypeConstants[fontType];

    return (width / cpl) * constant + "px";
}

function updateCharacterCountUI(textElement) {
    var spanElements = textElement.querySelectorAll("span");
    var maxElement = document.querySelector("[data-max-value]");
    var characterCountData = {
        lineLengths: [],
        maxLength: 0
    };
    var currentLineLength = 0;
    var currentYPosition;

    Array.prototype.forEach.call(spanElements, function (span, index) {

        var lengthWithoutSpace = span.innerHTML.length;
        var lengthWithSpace = lengthWithoutSpace + 1;

        if (span.offsetLeft === bodyMargin ) {
            // Span is left most

            if (span.offsetTop > currentYPosition && currentYPosition !== undefined) {
                // Span is first in row (not in element)

                characterCountData.lineLengths.push(currentLineLength);
            }

            currentLineLength = lengthWithSpace;
            currentYPosition = span.offsetTop;

        } else {
            // Span is mid sentence

            currentLineLength += lengthWithSpace;

        }

        if (index === (spanElements.length - 1)) {
            // Span is last word

            currentLineLength = currentLineLength - 1;    
            characterCountData.lineLengths.push(currentLineLength);

        }


    });

    characterCountData.maxLength = Math.max.apply(Math, characterCountData.lineLengths);

    maxElement.innerHTML = characterCountData.maxLength;

}

function addSpanElements(textElement) {
    var textValue = textElement.innerHTML;

    textValue = textValue.replace(/<span>/g, "");
    textValue = textValue.replace(/<\/span>/g, "");

    textValue = "<span>" + textValue + "</span>";
    textValue = textValue.replace(/\s/g, "</span> <span>");

    textElement.innerHTML = textValue;
}

// initialise

Array.prototype.forEach.call(document.querySelectorAll("[data-input]"), function (sliderElement) {
    sliderElement.addEventListener("input", updateText);
});

addSpanElements(textElement);
updateCharacterCountUI(textElement);