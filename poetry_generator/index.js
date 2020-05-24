// -- UTILITY FUNCTIONS
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

String.prototype.trim == String.prototype.trim || function () {
  return this.replace(/^\s+|\s+$/g, '');
}

// pg = Poetry Generator
var pg = {

  // -- BEGIN CONFIG ------------------------------------------------------------
  numSentences: 10,
  numSentencePatterns: null,

  // hard-coded sentence patterns is the simpler way
  // TODO: make more flexible / less artificial
  sentencePatterns: [
    ['article', 'adjective', 'noun', 'verb', 'adverb', 'preposition', 'article', 'noun'],
    ['pronoun', 'adverb', 'verb', 'noun', 'preposition', 'article', 'noun']
  ],

  languageParts: {
    'vowel': 'aeiou'.split(''),
    'article': {
      'beforeVowel': 'a|uma'.split('|'),
      'beforeConsonant': 'a'.split('|')
    },
    'preposition': 'a|ante|após|até|com|contra|em|entre|para|perante|através|sob|sobre|trás'.split('|'),
    'adjective': 'bonita|alta|fluindo|quente|fria|perfumada|misteriosa|seca|amaldiçoada|cega|apagada|acesa|elaborada|encantadora|brilhante|verde|forte|orgânica|suave|leve|esfumaçante'.split('|'),
    'adverb': 'rapidamente|lentamente|com força|sempre|ferozmente|elegantemente|fanaticamente|inocentemente|nervosa|com poder|raramente|silenciosamente|selvagem|calorosamente|solenemente'.split('|'),
    'noun': 'cabelo|mão|nuvem|perna|esfera|pedra|areia|grama|árvore|flor|maré|água|catarata|imensidão|nuvem|lua|estrela|galáxia|formiga|capivara'.split('|'),
    'pronoun': 'ele|ela|alguém'.split('|'),
    'verb': 'chuta|move|dança|corre|anda|voa|espirra|derrama|quebra|explode|diminui|adoça|cai|levanta|ouve|flutua'.split('|'),
    'stop': '.|?|!'.split('|'),
    'pause': ',|;|...| - |'.split('|')
  },
  // -- END CONFIG --------------------------------------------------------------

  init: function () {
    this.numSentencePatterns = this.sentencePatterns.length;
  },

  generateSentences: function (numSentences, markupBefore, markupAfter) {
    var numSentences = numSentences || this.numSentences;
    var markupBefore = markupBefore || '';
    var markupAfter = markupAfter || '';
    var sentences = [];

    while (numSentences--) {
      var sentence = '';
      var sentencePattern = this.sentencePatterns[randomInt(0, this.numSentencePatterns - 1)];

      // loop through sentence pattern array
      for (var i = 0, length = sentencePattern.length; i < length; i++) {
        var languagePartArray;
        var articleType;
        var nextWord = null;

        // if this word is an article, need to determine if next word starts with a vowel or consonant
        if (sentencePattern[i] === 'article') {
          // get next word
          var nextWordLanguagePartArray = this.languageParts[sentencePattern[i + 1]];
          var nextWord = nextWordLanguagePartArray[randomInt(0, nextWordLanguagePartArray.length - 1)];

          // set article type based on whether next word starts with vowel or consonant
          if (this.languageParts['vowel'].indexOf(nextWord[0]) !== -1) {
            articleType = 'beforeVowel';
          } else {
            articleType = 'beforeConsonant';
          }

          languagePartArray = this.languageParts[sentencePattern[i]][articleType];
        } else {
          languagePartArray = this.languageParts[sentencePattern[i]];
        }

        // add this word to sentence
        sentence += languagePartArray[randomInt(0, languagePartArray.length - 1)] + ' ';

        // if next word was gotten, also add next word to sentence and increment the i counter
        if (nextWord !== null) {
          sentence += nextWord + ' ';
          i++;
        }
      }

      sentences.push(markupBefore + sentence.trim() + markupAfter);
      // console.log(sentence);

    } // end while (numSentences--)

    return sentences;

  } // end generateSentences()
} // end poetryGenerator

// ----------------------------------------------------------------------------

$(document).ready(function () {

  // initialize poetry generator
  pg.init();

  $('.generate').on('click', function () {
    var sentences = pg.generateSentences($('#num-sentences').val(), '<p>', '</p>');
    $('#poetry-content').html(sentences.join(''));
  })

})